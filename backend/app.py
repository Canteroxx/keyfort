from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from base.db import db  
from routes import registrar_rutas
from base.models import Usuario 
from utils.contrasena import hashear_contrasena
from utils.cifrado_aes import generar_clave_usuario_cifrada  

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
CORS(app) 

app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(BASE_DIR, 'KeyFort.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

db.init_app(app)

registrar_rutas(app)

# ✅ Función que se ejecuta solo una vez al levantar
def inicializar_datos():
    with app.app_context():
        db.create_all()
        nombres = os.getenv("NAMES_ADMIN", "").split(",")
        correos = os.getenv("CORREOS_ADMIN", "").split(",")
        contrasenas = os.getenv("PASSWDS_ADMIN", "").split(",")

        for nombre, correo, contrasena in zip(nombres, correos, contrasenas):
            nombre = nombre.strip()
            correo = correo.strip()
            contrasena = contrasena.strip()

            if not Usuario.query.filter_by(correo=correo).first():
                clave_cifrada, salt = generar_clave_usuario_cifrada(contrasena)

                admin = Usuario(
                    nombre_usuario=nombre,
                    correo=correo,
                    contrasena_hash=hashear_contrasena(contrasena),
                    rol="Admin",
                    clave_cifrada=clave_cifrada,
                    salt=salt,
                    contrasena_temporal=False,
                )

                db.session.add(admin)

        db.session.commit()

inicializar_datos()
