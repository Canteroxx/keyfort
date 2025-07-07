# 🛡️ KeyFort - Plataforma Segura para la Gestión de Contraseñas

🔗 **Accede aquí:** [https://keyfort.vercel.app](https://keyfort.vercel.app)

## 🔐 ¿Cómo acceder a la aplicación?

1. El usuario recibe una **contraseña temporal** por correo electrónico tras ser registrado en el sistema.
2. Inicia sesión utilizando su **correo y contraseña temporal**.
3. Se le solicita **cambiar o mantener** la contraseña proporcionada.
4. Luego, debe escanear un **código QR** con Google Authenticator u otra aplicación compatible.
5. Ingresa el **código TOTP** generado por la app de autenticación.
6. Una vez verificado, accede a la plataforma con todas las funcionalidades habilitadas.

## 🧪 Funcionalidades disponibles

- **Gestión de contraseñas personales**:
  - Visualizar, agregar y eliminar credenciales propias.

- **Compartición de contraseñas**:
  - Compartir credenciales con otros usuarios.
  - Visualizar contraseñas que han sido compartidas con el usuario.

- **Otros beneficios**:
  - Envío automático de contraseñas temporales por correo.
  - Filtrado de credenciales que se pueden compartir dependiendo si ya han sido compartidas al usuario.
  - Todas tus contraseñas, incluyendo las que se te compartieron, estan cifradas por una clave propia que te  .pertenece.

⚠️ **Nota:**  
Las funcionalidades de **dashboard** y **gestión de grupos** están parcialmente desarrolladas y actualmente deshabilitadas (comentadas en el código). Estas funciones estaban pensadas exclusivamente para el rol de *Administrador*, pero se desactivaron temporalmente debido a posibles errores sin resolver. 

## 👥 Roles disponibles en la plataforma

### 👤 Usuario estándar
- Autenticación mediante **2FA (doble factor)**.
- Gestión completa de sus credenciales personales.
- Recepción de credenciales compartidas por otros usuarios.
- Capacidad para compartir sus credenciales con cualquier usuario.

### 🛠️ Administrador
- Todas las funciones del usuario estándar.
- Acceso a funciones avanzadas como:
  - Agregar nuevos usuarios.
 
