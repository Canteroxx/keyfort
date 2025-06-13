import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
import os

load_dotenv()

EMAIL_SENDER = os.getenv('EMAIL_SENDER')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')

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
