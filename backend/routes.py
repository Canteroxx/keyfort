from flask import request, jsonify
from sqlalchemy.exc import SQLAlchemyError
from cryptography.fernet import InvalidToken
from base.db import db
from base.models import Usuario, Credencial, Grupo, RegistroAcceso, CredencialCompartidaUsuario
from utils.contrasena import generar_contrasena, hashear_contrasena, checkear_contrasena
from utils.cifrado_aes import generar_clave_usuario_cifrada, obtener_fernet_usuario
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
        
    @app.route('/crear_credencial', methods=['POST'])
    @verificar_token
    def crear_credencial():
        data = request.get_json()
        
        campos_requeridos = ('usuario_id', 'servicio', 'usuario', 'contrasena_usuario', 'contrasena')
        if not all(k in data for k in campos_requeridos):
            return jsonify({'error': 'Faltan campos requeridos'}), 400

        usuario = Usuario.query.get(data['usuario_id'])
        if not usuario:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        try:
            fernet = obtener_fernet_usuario(usuario.clave_cifrada, usuario.salt, data['contrasena'])

            usuario_cifrado = fernet.encrypt(data['usuario'].encode()).decode()
            contrasena_cifrada = fernet.encrypt(data['contrasena_usuario'].encode()).decode()

            nueva_credencial = Credencial(
                servicio=data['servicio'],
                usuario_cifrado=usuario_cifrado,
                contrasena_cifrada=contrasena_cifrada,
                duenio_id=usuario.id
            )

            db.session.add(nueva_credencial)
            db.session.commit()

            return jsonify({'mensaje': 'Credencial creada exitosamente'}), 201

        except InvalidToken:
            db.session.rollback()
            return jsonify({'error': 'Contraseña Login incorrecta'}), 401

        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Error al crear la credencial', 'detalle': str(e)}), 500

        
    @app.route('/mis_credenciales', methods=['GET'])
    @verificar_token
    def obtener_lista_servicios():
        usuario_id = request.args.get('usuario_id')

        if not usuario_id:
            return jsonify({'error': 'Falta el usuario_id'}), 400

        usuario = Usuario.query.get(usuario_id)
        if not usuario:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        credenciales = Credencial.query.filter_by(duenio_id=usuario.id).all()

        lista = [{
            'id': c.id,
            'servicio': c.servicio,
        } for c in credenciales]

        return jsonify(lista), 200
    
    @app.route('/ver_credencial', methods=['POST'])
    @verificar_token
    def ver_credencial_completa():
        data = request.get_json()

        campos = ('usuario_id', 'credencial_id', 'contrasena_usuario', 'codigo_2fa')
        if not all(k in data for k in campos):
            return jsonify({'error': 'Faltan datos requeridos'}), 400

        usuario = Usuario.query.get(data['usuario_id'])
        if not usuario:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        credencial = Credencial.query.get(data['credencial_id'])
        if not credencial or credencial.duenio_id != usuario.id:
            return jsonify({'error': 'Credencial no encontrada o no pertenece al usuario'}), 403

        if not verificar_codigo_2fa(usuario.clave_2fa, data['codigo_2fa']):
            return jsonify({'error': 'Código 2FA incorrecto'}), 401

        try:
            fernet = obtener_fernet_usuario(usuario.clave_cifrada, usuario.salt, data['contrasena_usuario'])

            usuario_descifrado = fernet.decrypt(credencial.usuario_cifrado.encode()).decode()
            contrasena_descifrada = fernet.decrypt(credencial.contrasena_cifrada.encode()).decode()

            return jsonify({
                'usuario': usuario_descifrado,
                'contrasena': contrasena_descifrada
            }), 200

        except InvalidToken:
            return jsonify({'error': 'Contraseña Login incorrecta'}), 401

        except Exception as e:
            return jsonify({'error': 'Error al descifrar', 'detalle': str(e)}), 500

    @app.route('/eliminar_credencial', methods=['DELETE'])
    @verificar_token
    def eliminar_credencial():
        data = request.get_json()

        campos = ('usuario_id', 'credencial_id', 'contrasena_usuario', 'codigo_2fa')
        if not all(k in data for k in campos):
            return jsonify({'error': 'Faltan datos requeridos'}), 400

        usuario = Usuario.query.get(data['usuario_id'])
        if not usuario:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        if not checkear_contrasena(usuario.contrasena_hash, data['contrasena_usuario']):
            return jsonify({'error': 'Contraseña Login incorrecta'}), 401

        if not verificar_codigo_2fa(usuario.clave_2fa, data['codigo_2fa']):
            return jsonify({'error': 'Código 2FA incorrecto'}), 401

        credencial = Credencial.query.get(data['credencial_id'])
        if not credencial or credencial.duenio_id != usuario.id:
            return jsonify({'error': 'Credencial no encontrada o no pertenece al usuario'}), 403

        try:
            db.session.delete(credencial)
            db.session.commit()
            return jsonify({'mensaje': 'Credencial eliminada exitosamente'}), 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'error': 'Error al eliminar la credencial', 'detalle': str(e)}), 500
