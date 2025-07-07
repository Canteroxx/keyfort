# 🛡️ KeyFort - Plataforma de Gestión Segura de Contraseñas

## 🔐 ¿Cómo ingresar a la aplicación?

1. El usuario recibe una contraseña temporal por correo al ser registrado.
2. Inicia sesión en la aplicación con su correo y la contraseña temporal.
3. Se le solicita cambiar o conservar la contraseña.
4. Luego debe escanear un código QR con Google Authenticator (u otra app compatible).
5. Ingresa el código TOTP generado por su aplicación de autenticación.
6. Accede a la plataforma con todas las funcionalidades habilitadas.

## 🧪 Funcionalidades disponibles

- Gestión de contraseñas personales:
  - Ver, agregar y eliminar contraseñas propias.
- Compartición de contraseñas:
  - Compartir credenciales con otros usuarios del sistema.
  - Visualizar contraseñas compartidas recibidas.
- Envío automático de contraseñas temporales por correo.
- Búsqueda y filtrado de credenciales.

⚠️ Nota: Las funcionalidades de "dashboard" y "gestión de grupos" están parcialmente desarrolladas y su código permanece comentado.

## 👥 Roles y usuarios habilitados

- Usuario estándar:
  - Gestión de credenciales personales.
  - Uso de autenticación 2FA.
  - Recepción de contraseñas compartidas.

- Administrador:
  - Acceso a funciones avanzadas.
  - Gestión de usuarios y roles.
  - Capacidad para compartir credenciales con cualquier usuario.

# 🧪 Recomendación

Cargar usuarios de prueba en la base de datos para experimentar con las distintas funcionalidades.
