import os
from werkzeug.security import generate_password_hash, check_password_hash

def generar_contrasena():
    return os.urandom(8).hex()

def hashear_contrasena(contrasena):
    return generate_password_hash(contrasena)

def checkear_contrasena(contrasena, contrasena_ingresada):
    return check_password_hash(contrasena, contrasena_ingresada)