import jwt
from datetime import datetime, timedelta
from flask import request, jsonify, g, current_app
from functools import wraps

def generar_token(usuario_id, usuario_rol, usuario_contrasena, usuario_verificado, duracion_horas=1):
    expiracion = datetime.utcnow() + timedelta(hours=duracion_horas)
    payload = {
        'usuario_id': usuario_id,
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
