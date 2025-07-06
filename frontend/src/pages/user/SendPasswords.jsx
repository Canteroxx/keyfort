import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaPaperPlane, FaPlus, FaMinus } from 'react-icons/fa';
import { obtenerUsuariosct2fa, obtenerMisCredenciales, enviarSolicitudesCompartidas, obtenerCredencialesDelUsuario } from '../../services/service';
import { obtenerDatosToken } from '../../services/auth';

export default function Enviar() {
  const [todosLosUsuarios, setTodosLosUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [showFiltro, setShowFiltro] = useState(false);
  const [mostrarUsuarios, setMostrarUsuarios] = useState(true);
  const [mostrarAdmins, setMostrarAdmins] = useState(true);
  const [sendPassword, setSendPassword] = useState(false);
  const [credencialesSeleccionadas, setCredencialesSeleccionadas] = useState([]);
  const [usuarioDestino, setUsuarioDestino] = useState(null);
  const [credencialesFiltradas, setCredencialesFiltradas] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const datosToken = obtenerDatosToken(); // Extraer ID del usuario actual
      const miId = datosToken.usuario_id;

      const data = await obtenerUsuariosct2fa();

      // Filtrar usuarios que no sean el actual
      const filtrados = data.filter(usuario => usuario.id !== miId);

      setTodosLosUsuarios(filtrados);
    } catch (error) {
      console.error('Error al cargar usuarios:', error.message);
    }
  };

  const cargarCredenciales = async (receptor_id) => {
    try {
      const datosToken = obtenerDatosToken();
      const emisor_id = datosToken.usuario_id;

      const [resEmisor, resReceptor] = await Promise.all([
        obtenerMisCredenciales(emisor_id),  
        obtenerCredencialesDelUsuario(receptor_id) 
      ]);

      const filtradas = resEmisor.filter(
        cred => !resReceptor.credenciales_ids.includes(cred.id)
      );

      setCredencialesFiltradas(filtradas);

    } catch (err) {
      alert("Error al cargar credenciales: " + err.message);
    }
  };

  const usuariosFiltrados = todosLosUsuarios.filter(user =>
    user.nombre_usuario.toLowerCase().includes(filtro.toLowerCase()) &&
    ((mostrarUsuarios && user.rol === 'Usuario') || (mostrarAdmins && user.rol === 'Admin'))
  );

  const toggleSeleccionCredencial = (id) => {
    setCredencialesSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const compartirCredenciales = async () => {
    const datos = obtenerDatosToken();
    const muchas = credencialesSeleccionadas.length > 1;

    try {
      await enviarSolicitudesCompartidas(
        datos.usuario_id,
        usuarioDestino.id,
        credencialesSeleccionadas,
        muchas
      );
      alert("Solicitudes enviadas correctamente");
      setSendPassword(false);
      setCredencialesSeleccionadas([]);
    } catch (err) {
      alert("Error al enviar solicitud: " + err.message);
    }
  };

  return (
    <div className='text-3xl p-10 font-mono w-full text-md font-mono transition-all relative'>
      <p className='p-10 text-5xl text-white'>Enviar</p>
      <nav className="relative w-full mb-6 flex items-center gap-2">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full bg-white/5 text-white placeholder-white/50 rounded-xl pl-4 pr-10 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50" aria-label="Buscar">
            <FaSearch />
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFiltro(!showFiltro)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10"
            aria-label="Filtro"
          >
            <FaFilter />
          </button>

          {showFiltro && (
            <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md border border-white/20 text-white text-base rounded-xl p-4 z-10">
              <label className="block">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={mostrarAdmins}
                  onChange={() => setMostrarAdmins(!mostrarAdmins)}
                />
                Admins
              </label>
              <label className="block mt-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={mostrarUsuarios}
                  onChange={() => setMostrarUsuarios(!mostrarUsuarios)}
                />
                Usuarios
              </label>
            </div>
          )}
        </div>
      </nav>

      <section className='text-3xl'>
        {usuariosFiltrados.map((user) => (
          <article
            key={user.id}
            className='relative flex flex-row justify-between items-center bg-white/5 p-4 rounded-2xl shadow-xl border border-white/10 text-white mb-2'
          >
            <p>{user.nombre_usuario}</p>
            <div className="flex items-center gap-2 text-white/50 text-base">
              <span>{user.rol}</span>
              <button
                className="p-2 rounded-full hover:bg-white/20 transition"
                title="Enviar"
                onClick={() => {
                  setUsuarioDestino(user);
                  setSendPassword(true);
                  cargarCredenciales(user.id);
                }}
                aria-label={`Enviar credenciales a ${user.nombre_usuario}`}
              >
                <FaPaperPlane className="text-2xl text-white" />
              </button>
            </div>
          </article>
        ))}
      </section>

      {sendPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#e0f5ec] rounded-xl p-8 text-black shadow-lg space-y-4 w-[640px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold">Selecciona las contraseñas a enviar a:</h2>
            <span className="text-cyan-900">{usuarioDestino?.nombre_usuario || "..."}</span>
            <section className='text-xl p-4 rounded-2xl shadow-xl border border-white/10 bg-[#f4f0ff] space-y-2 max-h-96 overflow-auto'>
              {credencialesFiltradas.map((cred) => {
                const seleccionado = credencialesSeleccionadas.includes(cred.id);
                return (
                  <article
                    key={cred.id}
                    className={`flex justify-between items-center px-4 py-2 rounded-xl shadow-sm border 
                      ${seleccionado ? 'bg-[#b0b0b0] text-white' : 'bg-[#e7e6f8] text-black'}`}
                  >
                    <p>Servicio: {cred.servicio}</p>
                    <button onClick={() => toggleSeleccionCredencial(cred.id)} className="text-xl">
                      {seleccionado ? <FaMinus /> : <FaPlus />}
                    </button>
                  </article>
                );
              })}
            </section>

            <article className='flex justify-end items-center text-lg w-full space-x-2 px-4'>
              <button
                disabled={credencialesSeleccionadas.length === 0}
                onClick={() => compartirCredenciales()}
                className={`px-4 py-1 rounded text-white ${
                  credencialesSeleccionadas.length === 0
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-cyan-800 hover:bg-cyan-900"
                }`}
              >
                Enviar
              </button>
              <button
                onClick={() => {
                  setSendPassword(false);
                  setCredencialesSeleccionadas([]);
                }}
                className="bg-cyan-800 text-white px-4 py-1 rounded hover:bg-cyan-900"
              >
                Cerrar
              </button>
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
