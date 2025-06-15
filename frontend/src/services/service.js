const backendUrl = process.env.REACT_APP_BACKEND_URL;

function getAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem("token");
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...extraHeaders
  };
}

export async function obtenerUsuarios() {
  const response = await fetch(`${backendUrl}/extraer_usuarios`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Error al obtener los usuarios');
  }

  return await response.json();
}

export async function crearUsuario(nombre_usuario, correo, rol) {
  const respuesta = await fetch(`${backendUrl}/crear_usuario`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      nombre_usuario,
      correo,
      rol
    })
  });

  const data = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(data.error || 'Error al crear usuario');
  }

  return data;
}

export async function loginUsuario(correo, contrasena) {
  const response = await fetch(`${backendUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ correo, contrasena })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Error al iniciar sesión');
  }

  return data;
}

export async function enviarPrimerLogin({ usuario_id, nueva_contrasena = null, mantener_contrasena = false }) {
  const response = await fetch(`${backendUrl}/primer_login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usuario_id,
      nueva_contrasena,
      mantener_contrasena
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al procesar el primer login');
  }

  return data;
}

export async function configurar2FA(usuarioId) {
  const response = await fetch(`${backendUrl}/configurar_2fa`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ usuario_id: usuarioId })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al configurar 2FA');
  }

  return await data.uri;
}

export async function verificarCodigo2FA(usuarioId, codigo) {
  const response = await fetch(`${backendUrl}/verificar_2fa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usuario_id: usuarioId,
      codigo: codigo,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error en la verificación');
  }

  return data.token;
}
