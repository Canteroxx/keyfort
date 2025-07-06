import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { obtenerUsuarios, crearGrupo, obtenerGrupos, eliminarGrupo, eliminarUsuarioDelGrupo, agregarUsuarioAlGrupo } from '../../services/service';

export default function Grupos() {
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [nombre, setNombre] = useState('');
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]);
  const [users, setUsers] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null); // grupo donde se agregarán usuarios
  const [modalAgregarUsuarios, setModalAgregarUsuarios] = useState(false);
  const [usuariosAgregar, setUsuariosAgregar] = useState([]); // usuarios seleccionados en el modal


  const toggleSeleccion = (id) => {
    setUsuariosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const abrirModalAgregarUsuarios = (grupo) => {
    setGrupoSeleccionado(grupo);
    setUsuariosAgregar([]);
    setModalAgregarUsuarios(true);
  };


  const handleCerrarModal = () => {
    setShowAddGroup(false);
    setNombre('');
    setUsuariosSeleccionados([]);
  };

  const handleCrearGrupo = async () => {
    if (!nombre.trim()) {
      alert("Debes ingresar un nombre para el grupo.");
      return;
    }

    try {
      await crearGrupo(nombre, usuariosSeleccionados);
      alert("Grupo creado exitosamente");
      handleCerrarModal();
      await cargarGrupos(); // recargar grupos al crear
    } catch (error) {
      console.error('Error al crear grupo:', error.message);
      alert(error.message);
    }
  };

  const handleEliminarGrupo = async (grupoId) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este grupo?");
    if (!confirmacion) return;

    try {
      await eliminarGrupo(grupoId);
      alert("Grupo eliminado exitosamente");
      await cargarGrupos(); // actualiza la lista de grupos
    } catch (error) {
      alert("Error al eliminar grupo: " + error.message);
    }
  };

  const handleEliminarUsuario = async (grupoId, usuarioId) => {
    const confirmacion = window.confirm("¿Eliminar este usuario del grupo?");
    if (!confirmacion) return;

    try {
      await eliminarUsuarioDelGrupo(grupoId, usuarioId);
      await cargarGrupos(); // refresca la lista
    } catch (error) {
      alert("Error al eliminar usuario del grupo: " + error.message);
    }
  };

  const agregarUsuariosSeleccionados = async () => {
    try {
      for (const usuarioId of usuariosAgregar) {
        await agregarUsuarioAlGrupo(grupoSeleccionado.id, usuarioId);
      }
      setModalAgregarUsuarios(false);
      await cargarGrupos();
    } catch (error) {
      alert("Error al agregar usuarios: " + error.message);
    }
  };


  useEffect(() => {
    cargarUsuarios();
    cargarGrupos();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await obtenerUsuarios();

      // Filtrar solo los usuarios con rol "Usuario"
      const soloUsuarios = data.filter(user => user.rol === "Usuario");

      setUsers(soloUsuarios);
    } catch (error) {
      console.error('Error al cargar usuarios:', error.message);
    }
  };

  const cargarGrupos = async () => {
    try {
      const data = await obtenerGrupos();
      setGrupos(data);
    } catch (error) {
      console.error('Error al cargar grupos:', error.message);
    }
  };

  return (
    <div className='text-3xl p-10 font-mono w-full text-md transition-all relative'>
      <p className='p-10 text-5xl text-white'>Grupos</p>

      {/* Botón agregar grupo */}
      <nav className='justify-items-end px-5 pb-5'>
        <button onClick={() => setShowAddGroup(true)}
          className="flex flex-row items-center gap-3 px-4 py-2 rounded-md text-white text-xl bg-cyan-700 border border-cyan-300 hover:bg-cyan-800">
          <FaPlus />
          <span>Add Group</span>
        </button>
      </nav>

      {/* Lista de grupos */}
      <div className='space-y-4 text-white px-5'>
        {grupos.length === 0 && <p className="text-lg italic">No hay grupos registrados aún.</p>}
        {grupos.map((grupo) => (
          <div key={grupo.id} className="bg-[#222d3d] p-4 rounded-lg shadow-lg relative">
            <h3 className="text-2xl font-semibold">{grupo.nombre}</h3>
            <ul className="ml-4 mt-2 text-lg space-y-1">
              {grupo.usuarios.map(u => (
                <li key={u.id} className="flex justify-between items-center bg-[#2e3c4f] px-3 py-2 rounded">
                  <span>{u.nombre_usuario}</span>
                  <button
                    onClick={() => handleEliminarUsuario(grupo.id, u.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => abrirModalAgregarUsuarios(grupo)}
              className="mt-4 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
            >
              Agregar usuario
            </button>

            <button
              onClick={() => handleEliminarGrupo(grupo.id)}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
            >
              Eliminar grupo
            </button>
          </div>
        ))}
      </div>

      {/* Modal de crear grupo */}
      {showAddGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#e0f5ec] rounded-xl p-8 text-black shadow-lg space-y-4 w-[640px]">
            <h2 className="text-xl font-semibold">Crear Nuevo grupo</h2>
            <div className="flex flex-col space-y-2">
              <label htmlFor="name" className="text-lg">Nombre:</label>
              <input
                id="name"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="text-lg border border-black rounded-md px-2 py-1"
              />
              <section className='text-xl p-4 rounded-2xl shadow-xl border border-white/10 bg-[#f4f0ff] space-y-2 max-h-60 overflow-y-auto'>
                {users.map((user) => {
                  const seleccionado = usuariosSeleccionados.includes(user.id);
                  return (
                    <article
                      key={user.id}
                      className={`flex justify-between items-center px-4 py-2 rounded-xl shadow-sm border 
                        ${seleccionado ? 'bg-[#b0b0b0] text-white' : 'bg-[#e7e6f8] text-black'}`}>
                      <p>{user.nombre_usuario}</p>
                      <button onClick={() => toggleSeleccion(user.id)} className="text-xl">
                        {seleccionado ? <FaMinus /> : <FaPlus />}
                      </button>
                    </article>
                  );
                })}
              </section>
            </div>
            <article className='flex justify-end items-center text-lg w-full space-x-2 px-4'>
              <button onClick={handleCrearGrupo} className="bg-cyan-800 text-white px-4 py-1 rounded hover:bg-cyan-900">
                Guardar
              </button>
              <button onClick={handleCerrarModal} className="bg-cyan-800 text-white px-4 py-1 rounded hover:bg-cyan-900">
                Cerrar
              </button>
            </article>
          </div>
        </div>
      )}
      {modalAgregarUsuarios && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-black shadow-lg space-y-4 w-[640px]">
            <h2 className="text-xl font-semibold">Agregar usuarios a "{grupoSeleccionado.nombre}"</h2>
            <section className='text-xl p-4 rounded-2xl shadow-xl border bg-gray-100 space-y-2 max-h-60 overflow-y-auto'>
              {users.filter(u => !grupoSeleccionado.usuarios.some(g => g.id === u.id)).map(user => {
                const seleccionado = usuariosAgregar.includes(user.id);
                return (
                  <article
                    key={user.id}
                    className={`flex justify-between items-center px-4 py-2 rounded-xl shadow-sm border 
                      ${seleccionado ? 'bg-gray-400 text-white' : 'bg-white text-black'}`}>
                    <p>{user.nombre_usuario}</p>
                    <button onClick={() => {
                      setUsuariosAgregar(prev =>
                        prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id]
                      );
                    }} className="text-xl">
                      {seleccionado ? <FaMinus /> : <FaPlus />}
                    </button>
                  </article>
                );
              })}
            </section>
            <div className="flex justify-end space-x-2">
              <button onClick={agregarUsuariosSeleccionados} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Agregar</button>
              <button onClick={() => setModalAgregarUsuarios(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
