import pyotp

def generar_clave_2fa():
    return pyotp.random_base32()

def generar_uri_2fa(nombre_usuario: str, clave_2fa: str, nombre_sistema="KeyFort"):
    totp = pyotp.TOTP(clave_2fa)
    return totp.provisioning_uri(name=nombre_usuario, issuer_name=nombre_sistema)

def verificar_codigo_2fa(clave_secreta, codigo_ingresado):
    totp = pyotp.TOTP(clave_secreta)
    return totp.verify(codigo_ingresado, valid_window=1)
