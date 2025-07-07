import jwt
from datetime import datetime, timedelta
from flask import request, jsonify, g, current_app
from functools import wraps
from itsdangerous import TimedSerializer, BadSignature, SignatureExpired

def generar_token(usuario_id, usuario_nombre, usuario_correo, usuario_rol, duracion_horas=1):
    expiracion = datetime.utcnow() + timedelta(hours=duracion_horas)
    payload = {
        'usuario_id': usuario_id,
        'nombre': usuario_nombre,
        'correo': usuario_correo,
        'rol': usuario_rol,
        'exp': expiracion
    }
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
    return token


def verificar_token(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            partes = request.headers['Authorization'].split()
            if len(partes) == 2 and partes[0] == 'Bearer':
                token = partes[1]

        if not token:
            return jsonify({'error': 'Token faltante'}), 401

        try:
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            g.user = payload 
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401

        return func(*args, **kwargs)

    return wrapper

def generar_token_compartida(credenciales_data, receptor_id, grupo_id):
    s = TimedSerializer(current_app.config['SECRET_KEY'])
    token = s.dumps({
        'credenciales': credenciales_data,
        'usuario_id': receptor_id,
        'grupo_id': grupo_id
    })
    return token


def cargar_token_compartida(token, max_age=86400):  
    s = TimedSerializer(current_app.config['SECRET_KEY'])
    try:
        datos = s.loads(token, max_age=max_age)
        
        return {
            'credenciales': datos['credenciales'],
            'usuario_id': datos['usuario_id'],
            'grupo_id': datos.get('grupo_id')
        }

    except SignatureExpired:
        raise Exception('Token expirado')
    except BadSignature:
        raise Exception('Token inválido')

