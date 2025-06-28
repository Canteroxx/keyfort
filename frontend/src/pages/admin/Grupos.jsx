import React, { useState, useEffect } from 'react';
import { FaPlus, FaEllipsisV, FaMinus} from 'react-icons/fa';
import { crearUsuario, obtenerUsuarios } from '../../services/service';

export default function Grupos() {
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [contextMenuUser, setContextMenuUser] = useState(null);
  const [nombre, setNombre] = useState('');
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]);
  const [users, setUsers] = useState([]);
  const toggleSeleccion = (id) => {
    setUsuariosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleCerrarModal = () => {
    setShowAddGroup(false);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await obtenerUsuarios();
      const soloUsuarios = data.filter(user => user.rol === "Usuario");
      setUsers(soloUsuarios);
    } catch (error) {
      console.error('Error al cargar usuarios:', error.message);
    }
  };

  return (
    <div className='text-3xl p-10 font-mono w-full text-md transition-all relative'>
      <p className='p-10 text-5xl text-white'>Grupos</p>  
      <nav className='justify-items-end px-5 pb-5'>
        <button onClick={() => {setShowAddGroup(true);setContextMenuUser(null);}}
          className="flex flex-row items-center gap-3 px-4 py-2 rounded-md text-white text-xl bg-cyan-700 border border-cyan-300 hover:bg-cyan-800">
          <FaPlus />
          <span>Add Group</span>
        </button>
      </nav>

      {showAddGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 ">
          <div className="bg-[#e0f5ec] rounded-xl p-8 text-black shadow-lg space-y-4 w-[640px]">
            <h2 className="text-xl font-semibold">Crear Nuevo grupo</h2>
            <div className="flex flex-col space-y-2">
              <label htmlFor="name" className="text-lg">Nombre:</label>
              <input id="name" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="text-lg border border-black rounded-md px-2 py-1"/>
              <section className='text-xl p-4 rounded-2xl shadow-xl border border-white/10 bg-[#f4f0ff] space-y-2'>
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
              <button onClick={handleCerrarModal} className="bg-cyan-800 text-white px-4 py-1 rounded hover:bg-cyan-900">
                Guardar
              </button>
              <button onClick={handleCerrarModal} className="bg-cyan-800 text-white px-4 py-1 rounded hover:bg-cyan-900">
                Cerrar
              </button>
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
