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
    msg.set_content(
        f"Hola {nombre_usuario},\n\n"
        f"Tu contraseña temporal es: {contrasena_temp}\n\n"
        "Por favor cambia tu contraseña en el primer inicio de sesión en:\n"
        "https://keyfort.onrender.com\n\n"
        "Asegúrate de ingresar con el mismo correo electrónico al que te llegó este mensaje.\n\n"
        "Luego de modificar tu contraseña, configura Google Authenticator:\n"
        "1. Escanea el código QR que se mostrará en pantalla, o\n"
        "2. Ingresa manualmente el código proporcionado y selecciona la opción\n"
        "   de contraseña basada en tiempo (TOTP).\n\n"
        "Para completar la configuración, ingresa en la aplicación el código de 6 dígitos\n"
        "que genera tu Authenticator.\n\n"
        "Saludos,\n"
        "KeyFort Team"
    )

    with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
        smtp.starttls()
        smtp.login(EMAIL_SENDER, EMAIL_PASSWORD)
        smtp.send_message(msg)
