import React, { useState, useEffect, use } from 'react';
import { FaPlus, FaEllipsisV } from 'react-icons/fa';
import { crearUsuario, obtenerUsuarios } from '../../services/service';
import { obtenerDatosToken } from '../../services/auth';

export default function AddUser() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [contextMenuUser, setContextMenuUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [rol, setRol] = useState('Usuario');
  
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const datosToken = obtenerDatosToken();
      const miId = datosToken.usuario_id;
      const data = await obtenerUsuarios();
      const filtrados = data.filter(usuario => usuario.id !== miId);
      setUsers(filtrados);
    } catch (error) {
      console.error('Error al cargar usuarios:', error.message);
    }
  };

  const handleCerrarModal = () => {
    setShowAddModal(false);
    setNombre('');
    setCorreo('');
    setRol('Usuario');
};

  const handleCrearUsuario = async () => {
    try {
      const data = await crearUsuario(nombre, correo, rol);
      alert('Usuario creado exitosamente');
      setShowAddModal(false);
      setNombre('');
      setCorreo('');
      setRol('Usuario');
      cargarUsuarios();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className='text-3xl p-10 font-mono w-full text-md font-mono transition-all relative'>
      <nav className='flex flex-row items-end justify-between px-5 pb-5'>
      <p className='p-10 text-5xl text-white'>Usuarios</p>
        <button onClick={() => { setShowAddModal(true); setContextMenuUser(null); }}
          className="flex flex-row items-center gap-3 px-4 py-2 rounded-md text-white text-xl bg-cyan-700 border border-cyan-300 hover:bg-cyan-800">
          <FaPlus />
          <span>Add User</span>
        </button>
      </nav>
      <section className='text-3xl'>
        {users.map((user, i) => (
          <article
            key={i}
            className='relative flex flex-row justify-between bg-white/5 p-4 rounded-2xl shadow-xl border border-white/10 text-white mb-2'>
            <p>{user.nombre_usuario}</p>
            <button onClick={() => { setSelectedUser({ name: user.nombre_usuario, email: user.correo, rol: user.rol }); setShowInfoModal(true); setContextMenuUser(null); }}>
              <FaEllipsisV />
            </button>
          </article>
        ))}
      </section>

      {/* Modal Agregar Usuario */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-[480px] text-black shadow-lg space-y-4">
            <h2 className="text-xl font-semibold">Agregar Usuario</h2>

            <div className="flex flex-col space-y-2 ">
              <label htmlFor="name" className="text-lg">Nombre:</label>
              <input id="name" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="text-lg border border-black rounded-md px-2 py-1" />
              <label htmlFor="email" className="text-lg">Correo:</label>
              <input id="email" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} className="text-lg border border-black rounded-md px-2 py-1" />
            </div>

            <form className="flex justify-around pt-2">
              <div>
                <input type="radio" name="roleAdd" id="userAdd" value="Usuario" checked={rol === 'Usuario'} onChange={(e) => setRol(e.target.value)} />
                <label htmlFor="userAdd" className="ml-1">Usuario</label>
              </div>
              <div>
                <input type="radio" name="roleAdd" id="adminAdd" value="Admin" checked={rol === 'Admin'} onChange={(e) => setRol(e.target.value)} />
                <label htmlFor="adminAdd" className="ml-1">Admin</label>
              </div>
            </form>

              <article className='flex justify-end items-center text-lg w-full space-x-2 px-4'>
              <button onClick={handleCrearUsuario} className="bg-cyan-800 text-white px-4 py-1 rounded hover:bg-cyan-900">
                Guardar
              </button>
                <button onClick={handleCerrarModal} className="bg-cyan-800 text-white px-4 py-1 rounded hover:bg-cyan-900">
                  Cerrar
                </button>
            </article>
          </div>
        </div>
      )}

      {/* Modal Info Usuario */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 max-w-full">
          <div className="bg-white rounded-xl  p-8 w-[480px] text-black shadow-lg space-y-4">
            <h2 className="text-xl font-semibold">Info de {selectedUser?.name}</h2>

            <div className="flex flex-col space-y-2">
              <label className="text-lg">Nombre: {selectedUser?.name}</label>
              <label className="text-lg">Correo: {selectedUser?.email} </label>
            </div>

            <form className="flex justify-around pt-2">
              <div>
                <input
                  type="radio"
                  name="roleInfo"
                  id="userInfo"
                  value="Usuario"
                  checked={selectedUser?.rol === "Usuario"}
                  readOnly
                />
                <label htmlFor="userInfo" className="ml-1">Usuario</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="roleInfo"
                  id="adminInfo"
                  value="Admin"
                  checked={selectedUser?.rol === "Admin"}
                  readOnly
                />
                <label htmlFor="adminInfo" className="ml-1">Admin</label>
              </div>
            </form>


            <article className='flex justify-center items-center text-lg w-full px-4'>
              {/*<a href="#" className='text-red-400 font-semibold hover:underline'>Eliminar</a>*/}
              <div className='flex space-x-3'>
                {/*<button onClick={() => setShowEditModal(true)} className="bg-cyan-800 text-white px-4 py-1 rounded hover:bg-cyan-800">
                  Editar
                </button>*/}
                <button onClick={() => setShowInfoModal(false)} className="bg-cyan-800 text-white px-4 py-1 rounded hover:bg-cyan-800">
                  Cerrar
                </button>
              </div>
            </article>
          </div>
        </div>
      )}

      {/* Modal Editar Usuario */}
      {showEditModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-[480px] text-black shadow-lg space-y-4">
            <h2 className="text-xl font-semibold">Editar: {selectedUser?.name}</h2>

            <div className="text-base flex flex-col space-y-2">
              <label htmlFor="nameEdit" className="text-sm">Nombre:</label>
              <input id="nameEdit" type="text" placeholder={selectedUser?.name} className="text-sm border border-black rounded-md px-2 py-1" />
              <label htmlFor="emailEdit" className="text-sm">Email:</label>
              <input id="emailEdit" type="text" placeholder={selectedUser?.email} className="text-sm border border-black rounded-md px-2 py-1" />
            </div>

            <form className="flex justify-around pt-2">
              <div>
                <input type="radio" name="roleInfo" id="userEdit" value="Usuario" />
                <label htmlFor="userInfo" className="ml-1">Usuario</label>
              </div>
              <div>
                <input type="radio" name="roleInfo" id="adminEdit" value="Admin" />
                <label htmlFor="adminEdit" className="ml-1">Admin</label>
              </div>
            </form>

            <article className='flex justify-end items-center text-lg w-full space-x-2 px-4 mt-10'>
              <button onClick={() => setShowEditModal(false)} className="bg-cyan-800 text-white px-4 py-1 rounded hover:bg-cyan-900">
                Guardar
              </button>
                <button onClick={() => setShowEditModal(false)} className="bg-cyan-800 text-white px-4 py-1 rounded hover:bg-cyan-800">
                  Cerrar
                </button>
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
