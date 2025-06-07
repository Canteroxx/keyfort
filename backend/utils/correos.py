import smtplib
from email.message import EmailMessage

def enviar_correo_contrasena(correo_destino, nombre_usuario, contrasena_temp):
    msg = EmailMessage()
    msg['Subject'] = 'Tu contraseña temporal en KeyFort'
    msg['From'] = 'noreply@tuapp.com'
    msg['To'] = correo_destino
    msg.set_content(f'Hola {nombre_usuario},\n\nTu contraseña temporal es: {contrasena_temp}\nPor favor cambia tu contraseña en el primer inicio de sesión.\n\nSaludos,\nKeyFort Team')

    with smtplib.SMTP('smtp.tu-servidor.com', 587) as smtp:
        smtp.starttls()
        smtp.login('usuario_smtp', 'password_smtp')
        smtp.send_message(msg)
