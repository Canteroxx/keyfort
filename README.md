# Keyfort
# 🔐 KeyFort - Plataforma de Gestión Segura de Contraseñas Empresariales

KeyFort es una aplicación web enfocada en la **gestión centralizada y segura de credenciales empresariales**, diseñada especialmente para pequeñas y medianas empresas (PyMEs). Permite almacenar, compartir y consultar contraseñas utilizando cifrado robusto (AES) y autenticación multifactor (2FA).

## 🧠 Problema que Resuelve

La gestión de contraseñas en entornos empresariales representa un riesgo de seguridad constante debido a:
- Uso compartido inseguro de credenciales.
- Falta de control de acceso.
- Ausencia de cifrado y autenticación fuerte.

KeyFort aborda estas problemáticas mediante una plataforma accesible, segura y colaborativa.

## 🎯 Objetivos

- Desarrollar una solución segura para el manejo de credenciales empresariales.
- Usar **cifrado AES** para proteger credenciales en tránsito y almacenamiento.
- Implementar **autenticación en dos pasos (2FA)**.
- Gestionar permisos diferenciados según el rol del usuario.
- Facilitar la colaboración segura mediante la compartición de contraseñas personales o grupales.

## 👥 Usuarios Objetivo

- Administradores de sistemas
- Personal técnico y de soporte
- Recursos Humanos
- Empleados que necesitan acceso seguro a sistemas internos

## ⚙️ Funcionalidades Principales

- 🔐 Autenticación con usuario, contraseña y 2FA (TOTP)
- 🔒 Cifrado AES de todas las credenciales
- 👤 Gestión de usuarios y roles (Administrador / Usuario estándar)
- 👥 Agrupación funcional de usuarios (ej. conserjes, técnicos)
- 🧾 Historial de accesos y trazabilidad
- 📱 Interfaz web responsive (React)
- 🔍 Búsqueda y filtrado de credenciales

## 🏗️ Arquitectura del Sistema

- **Frontend**: React  
- **Backend**: Flask (Python)
- **Base de Datos**: SQLite  
- **Seguridad**: AES, TOTP para 2FA
