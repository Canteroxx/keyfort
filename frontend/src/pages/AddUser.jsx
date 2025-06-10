import { React, useState } from 'react'
import { FaPlus, FaEllipsisV } from 'react-icons/fa'

export default function AddUser() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedMail, setSelectedMail] = useState(null);
  const [contextMenuUser, setContextMenuUser] = useState(null);

	const users = [
	{ name: 'Joaquin Cantero', email: 'jcantero2023@alu.uct.cl' },
	{ name: 'Vicente Alvarez', email: 'valvarez2023alu.uct.cl' },
	{ name: 'Vicente Rivera', email: 'vrivera2023alu.uct.cl' },
	{ name: 'Fernando Valdes', email: 'fvaldes2023alu.uct.cl' },
	{ name: 'Juan Manuel Sepulveda', email: 'jsepulveda2023alu.uct.cl' },
	{ name: 'Juan Francisco Muñoz', email: 'jmuñoz2023alu.uct.cl' },
	{ name: 'Lukas Escobar', email: 'lescobar2023alu.uct.cl' }
	];

  return (
    <div className='text-3xl p-10 font-mono w-full text-md font-medium transition-all relative'>
      <p className='p-10 text-6xl text-white'>Usuarios</p>
      <nav className='justify-items-end px-5'>
        <button onClick={() => {setShowAddModal(true); setContextMenuUser(null);}}
          className="flex flex-row items-center gap-3 px-4 py-2 rounded-md text-white text-xl bg-cyan-700 border border-cyan-300 hover:bg-cyan-800">
          <FaPlus />
          <span>Add User</span>
        </button>
      </nav>

      <section className='p-5 space-y-5'>
        {users.map((user, i) => (
          <article key={i} onClick={() => {setSelectedUser(user);setShowInfoModal(true);setContextMenuUser(null);}}
			className='relative flex flex-row justify-between items-center bg-gray-900 text-white p-4 rounded-xl border border-white/30 hover:bg-cyan-800 cursor-pointer flex-1'>
            <p>{user.name}</p>
            <button
              onClick={(e) => {e.stopPropagation();setContextMenuUser(prev => prev === user.name ? null : user.name);}}>
              <FaEllipsisV />
            </button>
            {contextMenuUser === user.name && (
              <div className="text-xl absolute right-2 top-12 w-40 bg-white text-black rounded shadow-lg z-50 p-2">
                <p onClick={(e) => {e.stopPropagation(); setSelectedUser(user);setShowEditModal(true);setContextMenuUser(null);}}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
					Editar</p>
              </div>
            )}
          </article>
        ))}
      </section>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 text-black shadow-lg space-y-4">
            <h2 className="text-xl font-semibold">Agregar Usuario</h2>

            <div className="flex flex-col space-y-2">
              <label htmlFor="name" className="text-lg">Nombre:</label>
              <input id="name" type="text" className="border border-black rounded-md px-2 py-1" />

              <label htmlFor="email" className="text-lg">Correo:</label>
              <input id="email" type="email" className="border border-black rounded-md px-2 py-1" />
            </div>

            <form className="flex justify-around pt-2">
              <div>
                <input type="radio" name="roleAdd" id="userAdd" value="Usuario" />
                <label htmlFor="userAdd" className="ml-1">Usuario</label>
              </div>
              <div>
                <input type="radio" name="roleAdd" id="adminAdd" value="Admin" />
                <label htmlFor="adminAdd" className="ml-1">Admin</label>
              </div>
            </form>

            <button
              onClick={() => setShowAddModal(false)}
              className="w-full mt-4 bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 text-black shadow-lg space-y-4">
            <h2 className="text-xl font-semibold">Editar: {selectedUser?.name}</h2>

            <div className="text-xl flex flex-col space-y-2">
              <label htmlFor="nameEdit" className="text-lg">Nombre:</label>
              <input id="nameEdit" type="text" placeholder={selectedUser?.name} className="border border-black rounded-md px-2 py-1" />
			  <label htmlFor="emailEdit" className="text-lg">email:</label>
              <input id="emailEdit" type="text" placeholder={selectedUser?.email} className="border border-black rounded-md px-2 py-1" />
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

            <button onClick={() => setShowEditModal(false)} className="w-full mt-4 bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800">
              Cerrar
            </button>
          </div>
        </div>
      )}
	{showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 text-black shadow-lg space-y-4">
            <h2 className="text-xl font-semibold">Info de {selectedUser?.name}</h2>

            <div className="flex flex-col space-y-2">
              <label htmlFor="nameEdit" className="text-lg">Nombre: {selectedUser?.name}</label>
              <label htmlFor="emailEdit" className="text-lg">Correo: {selectedUser?.email} </label>
            </div>

            <form className="flex justify-around pt-2">
              <div>
                <input type="radio" name="roleInfo" id="userInfo" value="Usuario" checked readOnly/>
                <label htmlFor="userInfo" className="ml-1">Usuario</label>
              </div>
              <div>
                <input type="radio" name="roleInfo" id="adminInfo" value="Admin" disabled/>
                <label htmlFor="adminInfo" className="ml-1">Admin</label>
              </div>
            </form>

            <button onClick={() => setShowInfoModal(false)} className="w-full mt-4 bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
