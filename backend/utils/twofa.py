import pyotp

def generar_clave_2fa():
    return pyotp.random_base32()

def generar_uri_2fa(nombre_usuario: str, clave_2fa: str, nombre_sistema="KeyFort"):
    totp = pyotp.TOTP(clave_2fa)
    return totp.provisioning_uri(name=nombre_usuario, issuer_name=nombre_sistema)

def verificar_codigo_2fa(codigo):
     return pyotp.TOTP(codigo)
