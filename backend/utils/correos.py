import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
import os
import urllib.parse

load_dotenv()

EMAIL_SENDER = os.getenv('EMAIL_SENDER')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')
ROUTE_ACEPTAR = os.getenv('ROUTE_ACEPTAR')
ROUTE_ACEPTAR_GRUPO = os.getenv('ROUTE_ACEPTAR_GRUPO')

def enviar_correo_contrasena(correo_destino, nombre_usuario, contrasena_temp):
    msg = EmailMessage()
    msg['Subject'] = 'Tu contraseña temporal en KeyFort'
    msg['From'] = EMAIL_SENDER
    msg['To'] = correo_destino
    msg.set_content(f'Hola {nombre_usuario},\n\nTu contraseña temporal es: {contrasena_temp}\nPor favor cambia tu contraseña en el primer inicio de sesión.\n\nSaludos,\nKeyFort Team')

    with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
        smtp.starttls()
        smtp.login(EMAIL_SENDER, EMAIL_PASSWORD)
        smtp.send_message(msg)

def enviar_correo_notificacion_solicitud(destinatario, nombre_emisor, muchas, servicios, token, grupo=False):
    token_url = urllib.parse.quote(token)
    url = f"{ROUTE_ACEPTAR if not grupo else ROUTE_ACEPTAR_GRUPO}/{token_url}"

    servicios_texto = ', '.join(servicios) 

    # Configurar mensaje
    msg = EmailMessage()
    msg['Subject'] = (
        f"{nombre_emisor} quiere compartir {'varias contraseñas' if muchas else 'una contraseña'} contigo"
        if not grupo else
        f"Nuevo acceso compartido desde el grupo '{nombre_emisor}'"
    )
    msg['From'] = EMAIL_SENDER
    msg['To'] = destinatario

    if not grupo:
        cuerpo = f'''
Hola,

El usuario **{nombre_emisor}** desea compartir {'las contraseñas de los siguientes servicios' if muchas else 'la contraseña del siguiente servicio'} contigo:

{servicios_texto}

Para aceptar el acceso, haz clic en el siguiente enlace:

{url}

Este enlace es único y expirará en 24 horas.

Saludos cordiales,  
Equipo de KeyFort
'''
    else:
        cuerpo = f'''
Hola,

Desde el grupo **{nombre_emisor}**, se han compartido {'contraseñas de los siguientes servicios' if muchas else 'una contraseña del siguiente servicio'} contigo:

{servicios_texto}

Para aceptar el acceso, haz clic en el siguiente enlace:

{url}

Este enlace es único y estará disponible por 24 horas.

Saludos cordiales,  
Equipo de KeyFort
'''

    msg.set_content(cuerpo.strip())

    # Enviar correo
    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
            smtp.starttls()
            smtp.login(EMAIL_SENDER, EMAIL_PASSWORD)
            smtp.send_message(msg)
    except Exception as e:
        print(f"[ERROR] Falló el envío del correo a {destinatario}: {e}")
