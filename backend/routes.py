from flask import request, jsonify
from sqlalchemy.exc import SQLAlchemyError
from base.db import db
from base.models import Usuario, Credencial, Grupo, RegistroAcceso, CredencialCompartidaUsuario
from utils.contrasena import generar_contrasena, hashear_contrasena, checkear_contrasena
from utils.cifrado_aes import generar_clave_usuario_cifrada
from utils.twofa import generar_clave_2fa, generar_uri_2fa, verificar_codigo_2fa
from utils.correos import enviar_correo_contrasena
from utils.cambiar_contrasena import cambiar_contrasena
from utils.auth_token import generar_token, verificar_token

def registrar_rutas(app):
    @app.route('/extraer_usuarios', methods=['GET'])
    @verificar_token
    def obtener_usuarios():
        usuarios = Usuario.query.all()

        lista_usuarios = [{
            'id': u.id,
            'nombre_usuario': u.nombre_usuario,
            'correo': u.correo,
            'rol': u.rol
        } for u in usuarios]

        return jsonify(lista_usuarios), 200


    @app.route('/crear_usuario', methods=['POST'])
    @verificar_token
    def crear_usuario():
        data = request.get_json()

        if not all(k in data for k in ('nombre_usuario', 'rol', 'correo')):
            return jsonify({'error': 'Faltan campos requeridos'}), 400

        if Usuario.query.filter_by(correo=data['correo']).first():
            return jsonify({'error': 'Este correo ya está registrado'}), 409

        contrasena_temp = generar_contrasena()

        clave_cifrada, salt = generar_clave_usuario_cifrada(contrasena_temp)  

        nuevo = Usuario(
            nombre_usuario=data['nombre_usuario'],
            correo=data['correo'],  
            contrasena_hash=hashear_contrasena(contrasena_temp),
            rol=data['rol'],
            clave_cifrada=clave_cifrada,
            salt=salt,
        )

        db.session.add(nuevo)

        try:
            enviar_correo_contrasena(data['correo'], data['nombre_usuario'], contrasena_temp)
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'No se pudo enviar el correo, usuario no creado.', 'detalle': str(e)}), 500

        try:
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'error': 'Error al guardar usuario en la base de datos.', 'detalle': str(e)}), 500

        return jsonify({'mensaje': 'Usuario creado exitosamente'}), 201

    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()

        usuario = Usuario.query.filter_by(correo=data.get('correo')).first()
        if not usuario:
            return jsonify({'error': 'Correo no encontrado'}), 404

        if not checkear_contrasena(usuario.contrasena_hash, data.get('contrasena')):
            return jsonify({'error': 'Contraseña incorrecta'}), 401

        return jsonify({
            'mensaje': 'Login exitoso',
            'usuario': usuario.id,
            'contrasena_temporal': usuario.contrasena_temporal,
            'verificado_2fa': usuario.verificado_2fa
        }), 200

    @app.route('/primer_login', methods=['POST'])
    def primer_login():
        data = request.get_json()
        usuario = Usuario.query.filter_by(id=data.get('usuario_id')).first()

        if not usuario:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        if not usuario.contrasena_temporal:
            return jsonify({'error': 'La contraseña temporal ya fue cambiada'}), 403

        if data.get('mantener_contrasena'):
            usuario.contrasena_temporal = False
            db.session.commit()
            return jsonify({'mensaje': 'Contraseña temporal mantenida'}), 200

        nueva_contrasena = data.get('nueva_contrasena')
        if not nueva_contrasena:
            return jsonify({'error': 'Se requiere nueva contraseña'}), 400

        cambiar_contrasena(usuario, nueva_contrasena)
        usuario.contrasena_temporal = False
        db.session.commit()

        return jsonify({
            'mensaje': 'Contraseña cambiada exitosamente', 
            'contrasena_temporal': usuario.contrasena_temporal
        }), 200


    @app.route('/configurar_2fa', methods=['POST'])
    def configurar_2fa():
        data = request.get_json()
        usuario = Usuario.query.filter_by(id=data.get('usuario_id')).first()

        if not usuario:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        if usuario.clave_2fa and usuario.verificado_2fa:
            return jsonify({'error': '2FA ya configurado para este usuario'}), 400

        if usuario.clave_2fa and not usuario.verificado_2fa:
            uri = generar_uri_2fa(usuario.correo, usuario.clave_2fa)
        else:
            clave_2fa = generar_clave_2fa()
            uri = generar_uri_2fa(usuario.correo, clave_2fa)
            usuario.clave_2fa = clave_2fa
            db.session.commit()

        return jsonify({
            'mensaje': 'Código URI generado',
            'uri': uri
        }), 200

    @app.route('/verificar_2fa', methods=['POST'])
    def verificar_2fa():
        data = request.get_json()
        usuario = Usuario.query.filter_by(id=data.get('usuario_id')).first()

        if not usuario or not usuario.clave_2fa:
            return jsonify({'error': 'Usuario o 2FA no configurado'}), 404

        codigo_ingresado = data.get('codigo')

        if verificar_codigo_2fa(usuario.clave_2fa, codigo_ingresado):
            if not usuario.verificado_2fa:
                usuario.verificado_2fa = True
                db.session.commit()

            token = generar_token(usuario.id, usuario.rol)


            return jsonify({
                'mensaje': '2FA verificado correctamente',
                'token': token
            }), 200
        else:
            return jsonify({'error': 'Código incorrecto'}), 401