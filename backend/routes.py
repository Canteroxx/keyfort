from flask import request, jsonify
from sqlalchemy.exc import SQLAlchemyError
from cryptography.fernet import InvalidToken
from base.db import db
from base.models import Usuario, Credencial, Grupo, RegistroAcceso, CredencialCompartidaUsuario, TokenCompartidoUsado
from utils.contrasena import generar_contrasena, hashear_contrasena, checkear_contrasena
from utils.cifrado_aes import generar_clave_usuario_cifrada, obtener_fernet_usuario
from utils.twofa import generar_clave_2fa, generar_uri_2fa, verificar_codigo_2fa
from utils.correos import enviar_correo_contrasena, enviar_correo_notificacion_solicitud
from utils.cambiar_contrasena import cambiar_contrasena
from utils.auth_token import generar_token, verificar_token, generar_token_compartida, cargar_token_compartida

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
    
    @app.route('/extraer_usuarios_ct2fa', methods=['GET'])
    @verificar_token
    def obtener_usuarios_ct2fa():
        usuarios = Usuario.query.filter_by(contrasena_temporal=False, verificado_2fa=True).all()

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

            token = generar_token(usuario.id, usuario.nombre_usuario, usuario.correo, usuario.rol)


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

    @app.route('/mis_credenciales_completas', methods=['GET'])
    @verificar_token
    def obtener_credenciales_completas():
        usuario_id = request.args.get('usuario_id')

        if not usuario_id:
            return jsonify({'error': 'Falta el usuario_id'}), 400

        usuario = Usuario.query.get(usuario_id)
        if not usuario:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        credenciales_propias = Credencial.query.filter_by(duenio_id=usuario.id).all()
        credenciales_compartidas = CredencialCompartidaUsuario.query.filter_by(usuario_id=usuario.id).all()

        lista_propias = [{
            'id': c.id,
            'servicio': c.servicio,
            'tipo': 'propia'
        } for c in credenciales_propias]

        lista_compartidas = [{
            'id': c.credencial.id,  # o c.credencial_id
            'servicio': c.credencial.servicio,
            'tipo': 'compartida',
            'duenio': c.credencial.duenio.nombre_usuario
        } for c in credenciales_compartidas]

        return jsonify(lista_propias + lista_compartidas), 200
        
    @app.route('/ver_credencial', methods=['POST'])
    @verificar_token
    def ver_credencial_completa():
        data = request.get_json()

        campos = ('usuario_id', 'credencial_id', 'tipo', 'contrasena_usuario', 'codigo_2fa')
        if not all(k in data for k in campos):
            return jsonify({'error': 'Faltan datos requeridos'}), 400

        usuario = Usuario.query.get(data['usuario_id'])
        if not usuario:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        # Verificar tipo de credencial
        if data['tipo'] == 'propia':
            credencial = Credencial.query.get(data['credencial_id'])
            if not credencial or credencial.duenio_id != usuario.id:
                return jsonify({'error': 'Credencial propia no encontrada'}), 403
        else:
            credencial = CredencialCompartidaUsuario.query.filter_by(
                credencial_id=data['credencial_id'],
                usuario_id=usuario.id
            ).first()
            if not credencial:
                return jsonify({'error': 'Credencial compartida no encontrada'}), 403

        # Verificar 2FA
        if not verificar_codigo_2fa(usuario.clave_2fa, data['codigo_2fa']):
            return jsonify({'error': 'Código 2FA incorrecto'}), 401

        # Descifrado
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

        campos = ('usuario_id', 'credencial_id', 'contrasena_usuario', 'codigo_2fa', 'tipo')
        if not all(k in data for k in campos):
            return jsonify({'error': 'Faltan datos requeridos'}), 400

        usuario = Usuario.query.get(data['usuario_id'])
        if not usuario:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        if not checkear_contrasena(usuario.contrasena_hash, data['contrasena_usuario']):
            return jsonify({'error': 'Contraseña Login incorrecta'}), 401

        if not verificar_codigo_2fa(usuario.clave_2fa, data['codigo_2fa']):
            return jsonify({'error': 'Código 2FA incorrecto'}), 401

        try:
            if data['tipo'] == 'propia':
                credencial = Credencial.query.get(data['credencial_id'])
                if not credencial or credencial.duenio_id != usuario.id:
                    return jsonify({'error': 'Credencial propia no encontrada o no pertenece al usuario'}), 403

                db.session.delete(credencial)

            elif data['tipo'] == 'compartida':
                credencial_compartida = CredencialCompartidaUsuario.query.filter_by(
                    credencial_id=data['credencial_id'],
                    usuario_id=usuario.id
                ).first()

                if not credencial_compartida:
                    return jsonify({'error': 'Credencial compartida no encontrada'}), 403

                db.session.delete(credencial_compartida)

            else:
                return jsonify({'error': 'Tipo de credencial inválido'}), 400

            db.session.commit()
            return jsonify({'mensaje': 'Credencial eliminada exitosamente'}), 200

        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'error': 'Error al eliminar la credencial', 'detalle': str(e)}), 500


    @app.route('/crear_grupo', methods=['POST'])
    @verificar_token
    def crear_grupo():
        data = request.get_json()
        
        if not data or 'nombre' not in data:
            return jsonify({'error': 'Falta el nombre del grupo'}), 400

        nombre = data['nombre']
        usuarios_ids = data.get('usuarios', [])  # puede venir vacío

        if Grupo.query.filter_by(nombre=nombre).first():
            return jsonify({'error': 'Ya existe un grupo con este nombre'}), 409

        nuevo_grupo = Grupo(nombre=nombre)

        # Asocia usuarios si hay IDs válidos
        for uid in usuarios_ids:
            usuario = Usuario.query.get(uid)
            if usuario:
                nuevo_grupo.usuarios.append(usuario)

        try:
            db.session.add(nuevo_grupo)
            db.session.commit()
            return jsonify({'mensaje': 'Grupo creado exitosamente', 'grupo_id': nuevo_grupo.id}), 201
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'error': 'Error al guardar el grupo en la base de datos', 'detalle': str(e)}), 500

    @app.route('/grupos', methods=['GET'])
    @verificar_token
    def listar_grupos():
        grupos = Grupo.query.all()
        resultado = []
        for grupo in grupos:
            resultado.append({
                'id': grupo.id,
                'nombre': grupo.nombre,
                'usuarios': [{'id': u.id, 'nombre_usuario': u.nombre_usuario} for u in grupo.usuarios]
            })
        return jsonify(resultado), 200

    @app.route('/eliminar_grupo/<int:grupo_id>', methods=['DELETE'])
    @verificar_token
    def eliminar_grupo(grupo_id):
        grupo = Grupo.query.get(grupo_id)
        if not grupo:
            return jsonify({'error': 'Grupo no encontrado'}), 404

        try:
            db.session.delete(grupo)
            db.session.commit()
            return jsonify({'mensaje': 'Grupo eliminado exitosamente'}), 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'error': 'Error al eliminar el grupo', 'detalle': str(e)}), 500

    # Flask: eliminar usuario de grupo
    @app.route('/grupo/<int:grupo_id>/eliminar_usuario', methods=['DELETE'])
    def eliminar_usuario_de_grupo(grupo_id):
        data = request.get_json()
        usuario_id = data.get('usuario_id')

        grupo = Grupo.query.get_or_404(grupo_id)

        usuario = Usuario.query.get_or_404(usuario_id)
        if usuario in grupo.usuarios:
            grupo.usuarios.remove(usuario)
            db.session.commit()
            return jsonify({'mensaje': 'Usuario eliminado del grupo'}), 200
        else:
            return jsonify({'error': 'Usuario no pertenece al grupo'}), 400

    @app.route('/grupo/<int:grupo_id>/agregar_usuario', methods=['POST'])
    def agregar_usuario_a_grupo(grupo_id):
        data = request.get_json()
        usuario_id = data.get('usuario_id')

        grupo = Grupo.query.get_or_404(grupo_id)
        usuario = Usuario.query.get_or_404(usuario_id)

        if usuario in grupo.usuarios:
            return jsonify({'error': 'El usuario ya pertenece al grupo'}), 400

        grupo.usuarios.append(usuario)
        db.session.commit()
        return jsonify({'mensaje': 'Usuario agregado al grupo'}), 200

    @app.route('/solicitar_compartir', methods=['POST'])
    @verificar_token
    def solicitar_compartir():
        data = request.get_json()
        emisor_id = data.get('emisor_id')
        receptor_id = data.get('receptor_id')
        credencial_ids = data.get('credenciales_ids')
        muchas_creds = data.get('muchas')

        if not all([emisor_id, receptor_id, credencial_ids]):
            return jsonify({'error': 'Faltan datos'}), 400

        emisor = Usuario.query.get(emisor_id)
        receptor = Usuario.query.get(receptor_id)

        if not emisor or not receptor:
            return jsonify({'error': 'Emisor o receptor no encontrado'}), 404

        credenciales_validas = []
        servicios = []
        for cred_id in credencial_ids:
            credencial = Credencial.query.get(cred_id)
            if credencial and credencial.duenio_id == emisor_id:
                credenciales_validas.append(cred_id)
                servicios.append(credencial.servicio)

        if not credenciales_validas:
            return jsonify({'error': 'No se encontraron credenciales válidas para compartir'}), 400

        token = generar_token_compartida(credenciales_validas, receptor_id)

        try:
            enviar_correo_notificacion_solicitud(receptor.correo, emisor.nombre_usuario, muchas_creds, servicios, token)
            return jsonify({'mensaje': 'Solicitud enviada'}), 200
        except Exception as e:
            return jsonify({'error': 'Error al enviar correo', 'detalle': str(e)}), 500

    @app.route('/validar_token_compartida/<token>', methods=['GET'])
    def validar_token_compartida(token):
        try:
            # Verifica si ya se usó
            if TokenCompartidoUsado.query.filter_by(token=token).first():
                return jsonify({'error': 'Este enlace ya fue utilizado'}), 400

            datos = cargar_token_compartida(token)
            receptor_id = datos.get('usuario_id')
            usuario = Usuario.query.get(receptor_id)

            if not usuario:
                return jsonify({'error': 'Usuario receptor no encontrado'}), 404

            return jsonify({'mensaje': 'Token válido'}), 200
            
        except Exception:
            return jsonify({'error': 'Token inválido'}), 400


    @app.route('/aceptar_compartida', methods=['POST'])
    def aceptar_compartida():
        data = request.get_json()
        token = data.get('token')
        contrasena = data.get('contrasena')

        if not token or not contrasena:
            return jsonify({'error': 'Faltan datos'}), 400

        if TokenCompartidoUsado.query.filter_by(token=token).first():
            return jsonify({'error': 'Este enlace ya fue utilizado'}), 400

        try:
            datos = cargar_token_compartida(token)
            credenciales_ids = datos['credenciales_ids']
            receptor_id = datos['usuario_id']
        except Exception:
            return jsonify({'error': 'Token inválido'}), 400

        receptor = Usuario.query.get(receptor_id)
        if not receptor:
            return jsonify({'error': 'Usuario receptor no encontrado'}), 404

        try:
            fernet_receptor = obtener_fernet_usuario(receptor.clave_cifrada, receptor.salt, contrasena)
        except InvalidToken:
            return jsonify({'error': 'Contraseña incorrecta para desencriptar receptor'}), 401

        try:
            for cred_id in credenciales_ids:
                credencial = Credencial.query.get(cred_id)
                if not credencial:
                    continue

                emisor = Usuario.query.get(credencial.duenio_id)
                if not emisor:
                    continue

                try:
                    fernet_emisor = obtener_fernet_usuario(emisor.clave_cifrada, emisor.salt, contrasena)
                    usuario_desc = fernet_emisor.decrypt(credencial.usuario_cifrado.encode()).decode()
                    contrasena_desc = fernet_emisor.decrypt(credencial.contrasena_cifrada.encode()).decode()
                except Exception:
                    continue  # Ignora si falla el descifrado

                usuario_cif = fernet_receptor.encrypt(usuario_desc.encode()).decode()
                contrasena_cif = fernet_receptor.encrypt(contrasena_desc.encode()).decode()

                ya_existe = CredencialCompartidaUsuario.query.filter_by(
                    credencial_id=credencial.id,
                    usuario_id=receptor.id
                ).first()
                if ya_existe:
                    continue

                nueva = CredencialCompartidaUsuario(
                    credencial_id=credencial.id,
                    usuario_id=receptor.id,
                    usuario_cifrado=usuario_cif,
                    contrasena_cifrada=contrasena_cif
                )
                db.session.add(nueva)

            usado = TokenCompartidoUsado(token=token)
            db.session.add(usado)

            db.session.commit()
            return jsonify({'mensaje': 'Credenciales compartidas exitosamente'}), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Error al compartir las credenciales', 'detalle': str(e)}), 500


    @app.route('/credenciales_usuario/<int:usuario_id>', methods=['GET'])
    @verificar_token
    def obtener_credenciales_usuario(usuario_id):
        usuario = Usuario.query.get(usuario_id)
        if not usuario:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        compartidas_ids = [c.credencial_id for c in CredencialCompartidaUsuario.query.filter_by(usuario_id=usuario.id).all()]
        
        return jsonify({'credenciales_ids': compartidas_ids}), 200
    
    @app.route('/ya_aceptada', methods=['POST'])
    def verificar_todas_aceptadas():
        data = request.get_json()
        credenciales_ids = data.get('credenciales_ids')
        usuario_id = data.get('usuario_id')

        if not credenciales_ids or not usuario_id:
            return jsonify({'error': 'Faltan datos'}), 400

        # Consultamos todas las credenciales que ya están compartidas con el receptor
        aceptadas = db.session.query(CredencialCompartidaUsuario.credencial_id).filter_by(
            usuario_id=usuario_id
        ).filter(
            CredencialCompartidaUsuario.credencial_id.in_(credenciales_ids)
        ).all()

        ids_aceptadas = {c[0] for c in aceptadas}
        todas_aceptadas = all(cred_id in ids_aceptadas for cred_id in credenciales_ids)

        return jsonify({'todas_aceptadas': todas_aceptadas}), 200
