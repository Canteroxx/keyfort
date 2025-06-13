from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from cryptography.fernet import Fernet
import base64
import os

def derivar_clave_desde_contrasena(contrasena: str, salt: bytes, iteraciones=100_000) -> bytes:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=iteraciones,
        backend=default_backend()
    )
    return base64.urlsafe_b64encode(kdf.derive(contrasena.encode()))

def generar_clave_usuario_cifrada(contrasena: str):
    clave_aes = Fernet.generate_key()
    salt = os.urandom(16)
    clave_derivada = derivar_clave_desde_contrasena(contrasena, salt)
    fernet = Fernet(clave_derivada)
    clave_cifrada = fernet.encrypt(clave_aes)
    return clave_cifrada, salt

