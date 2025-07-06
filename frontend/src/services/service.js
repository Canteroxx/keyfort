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

export async function obtenerUsuariosct2fa() {
  const response = await fetch(`${backendUrl}/extraer_usuarios_ct2fa`, {
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

export async function crearCredencial(usuario_id, servicio, usuario, contrasena_usuario, contrasena) {
  const respuesta = await fetch(`${backendUrl}/crear_credencial`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      usuario_id: usuario_id,
      servicio: servicio,
      usuario: usuario,
      contrasena_usuario: contrasena_usuario,
      contrasena: contrasena
    })
  });

  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.error || 'Error al crear credencial');
  return data;
}

export async function obtenerMisCredenciales(usuario_id) {
  const response = await fetch(`${backendUrl}/mis_credenciales?usuario_id=${usuario_id}`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al obtener servicios');
  return data;
}

export async function obtenerCredencialesCompletas(usuario_id) {
  const response = await fetch(`${backendUrl}/mis_credenciales_completas?usuario_id=${usuario_id}`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al obtener credenciales');
  return data;
}

export async function verCredencial({ usuario_id, credencial_id, tipo, contrasena_usuario, codigo_2fa }) {
  const response = await fetch(`${backendUrl}/ver_credencial`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      usuario_id,
      credencial_id,
      tipo,
      contrasena_usuario,
      codigo_2fa
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al desencriptar la credencial');
  return data;
}

export async function eliminarCredencial({ usuario_id, credencial_id, tipo, contrasena_usuario, codigo_2fa }) {
  const response = await fetch(`${backendUrl}/eliminar_credencial`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      usuario_id,
      credencial_id,
      tipo,
      contrasena_usuario,
      codigo_2fa
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al eliminar credencial');
  return data;
}

export async function crearGrupo(nombre, usuarios = []) {
  const response = await fetch(`${backendUrl}/crear_grupo`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      nombre: nombre,
      usuarios: usuarios
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error al crear grupo');
  }

  return data;
}

export async function obtenerGrupos() {
  const response = await fetch(`${backendUrl}/grupos`, {
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al obtener grupos');
  return data;
}

export async function eliminarGrupo(grupoId) {
  const response = await fetch(`${backendUrl}/eliminar_grupo/${grupoId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al eliminar grupo');
  return data;
}

export async function eliminarUsuarioDelGrupo(grupoId, usuarioId) {
  const response = await fetch(`${backendUrl}/grupo/${grupoId}/eliminar_usuario`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    body: JSON.stringify({ usuario_id: usuarioId }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al eliminar usuario del grupo');
  return data;
}

export async function agregarUsuarioAlGrupo(grupoId, usuarioId) {
  const response = await fetch(`${backendUrl}/grupo/${grupoId}/agregar_usuario`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ usuario_id: usuarioId }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al agregar usuario al grupo');
  return data;
}

export async function obtenerCredencialesDelUsuario(usuario_id) {

  const response = await fetch(`${backendUrl}/credenciales_usuario/${usuario_id}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error ||  'Error al obtener credenciales del usuario');
  return data;
}

export async function enviarSolicitudesCompartidas(emisor_id, receptor_id, credenciales_ids, muchas) {
  const response = await fetch(`${backendUrl}/solicitar_compartir`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      emisor_id,
      receptor_id,
      credenciales_ids,
      muchas
    })
  });

  const data = await response.json();
  if (!response.ok) {throw new Error(data.error || 'Error al enviar solicitudes de compartir credenciales');}
  return data;
}

export async function verificarYaAceptadas(payload) {
  const response = await fetch(`${backendUrl}/ya_aceptada`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {throw new Error(data.error || 'Error al verificar si ya fue aceptada');}
  return data;
}


export async function validarTokenCompartida(token) {
  const response = await fetch(`${backendUrl}/validar_token_compartida/${token}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  const data = await response.json();
  if (!response.ok) {throw new Error(data.error || 'Error al validar token temporal');}
  return data;
}


export async function aceptarCompartida(token, contrasena) {
  const response = await fetch(`${backendUrl}/aceptar_compartida`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token,
      contrasena
    })
  });

  const data = await response.json();
  if (!response.ok) {throw new Error(data.error || 'Error al aceptar la credencial compartida');}
  return data;
}

