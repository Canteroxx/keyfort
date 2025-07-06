from base.db import db
from datetime import datetime

usuarios_grupos = db.Table('usuarios_grupos',
    db.Column('usuario_id', db.Integer, db.ForeignKey('usuarios.id'), primary_key=True),
    db.Column('grupo_id', db.Integer, db.ForeignKey('grupos.id'), primary_key=True)
)

compartidas_grupos = db.Table('credenciales_compartidas_grupos',
    db.Column('credencial_id', db.Integer, db.ForeignKey('credenciales.id'), primary_key=True),
    db.Column('grupo_id', db.Integer, db.ForeignKey('grupos.id'), primary_key=True)
)

class Usuario(db.Model):
    __tablename__ = 'usuarios'

    id = db.Column(db.Integer, primary_key=True)
    nombre_usuario = db.Column(db.String(80), unique=False, nullable=False)
    correo = db.Column(db.String(120), unique=True, nullable=False)
    contrasena_hash = db.Column(db.String(128), nullable=False)
    rol = db.Column(db.String(20), nullable=False) 
    clave_2fa = db.Column(db.String(16), nullable=True, default=None)
    clave_cifrada = db.Column(db.LargeBinary, nullable=False)
    salt = db.Column(db.LargeBinary, nullable=False)
    contrasena_temporal = db.Column(db.Boolean, default=True)  
    verificado_2fa = db.Column(db.Boolean, default=False)

    grupos = db.relationship('Grupo', secondary=usuarios_grupos, back_populates='usuarios')
    credenciales_propias = db.relationship('Credencial', backref='duenio', lazy=True)
    accesos = db.relationship('RegistroAcceso', backref='usuario', lazy=True)


class Grupo(db.Model):
    __tablename__ = 'grupos'

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), unique=True, nullable=False)

    usuarios = db.relationship('Usuario', secondary=usuarios_grupos, back_populates='grupos')
    credenciales = db.relationship('Credencial', secondary=compartidas_grupos, back_populates='grupos_compartidos')

class Credencial(db.Model):
    __tablename__ = 'credenciales'

    id = db.Column(db.Integer, primary_key=True)
    servicio = db.Column(db.String(100), nullable=False)
    usuario_cifrado = db.Column(db.Text, nullable=False)
    contrasena_cifrada = db.Column(db.Text, nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

    duenio_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)

    grupos_compartidos = db.relationship(
        'Grupo',
        secondary=compartidas_grupos,
        back_populates='credenciales'
    )

    usuarios_compartidos = db.relationship(
        'CredencialCompartidaUsuario',
        backref='credencial',
        lazy=True,
        cascade="all, delete-orphan"
    )

    accesos = db.relationship(
        'RegistroAcceso',
        backref='credencial',
        lazy=True,
        cascade="all, delete-orphan"
    )


class CredencialCompartidaUsuario(db.Model):
    __tablename__ = 'credenciales_compartidas_usuarios'

    credencial_id = db.Column(db.Integer, db.ForeignKey('credenciales.id'), primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), primary_key=True)

    usuario_cifrado = db.Column(db.Text, nullable=False)
    contrasena_cifrada = db.Column(db.Text, nullable=False)

    usuario = db.relationship('Usuario', backref='credenciales_recibidas')

class RegistroAcceso(db.Model):
    __tablename__ = 'registro_accesos'

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    credencial_id = db.Column(db.Integer, db.ForeignKey('credenciales.id'), nullable=False)

    tipo_acceso = db.Column(db.String(50), nullable=False)  
    fecha_hora = db.Column(db.DateTime, default=datetime.utcnow)

class TokenCompartidoUsado(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(512), unique=True, nullable=False)
    usado_en = db.Column(db.DateTime, default=datetime.utcnow)
