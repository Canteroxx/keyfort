from werkzeug.security import generate_password_hash
from utils.cifrado_aes import generar_clave_usuario_cifrada

def cambiar_contrasena(usuario, nueva_contrasena, temporal=False):
    clave_cifrada, salt = generar_clave_usuario_cifrada(nueva_contrasena)
    usuario.contrasena_hash = generate_password_hash(nueva_contrasena)
    usuario.clave_cifrada = clave_cifrada
    usuario.salt = salt
    usuario.contrasena_temporal = temporal
