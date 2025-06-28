import { React, useState } from 'react'
import { FaPlus, FaEllipsisV, FaEye, FaEyeSlash} from 'react-icons/fa'

export default function Contraseñas() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedName, setSelectedName] = useState(null);
  const [contextMenuUser, setContextMenuUser] = useState(null);
  const [passwords, setPasswords] = useState([]);

  // poni aqui la funcion pa crear contraseñas

  return (
	<div className='text-3xl p-10 font-mono w-full text-md font-medium transition-all relative'>
	  <p className='p-10 text-5xl text-white'>Contraseñas</p>
	  <nav className='justify-items-end px-5 pb-5'>
		<button onClick={() => {setShowAddModal(true); setContextMenuUser(null);}}
		  className="flex flex-row items-center gap-3 px-4 py-2 rounded-md text-white text-xl bg-cyan-700 border border-cyan-300 hover:bg-cyan-800">
		  <FaPlus />
		  <span>Add Password</span>
		</button>
	  </nav>
		{/*<section className="mt-4 space-y-4"> 
		{passwords.map((item, index) => (
			<div key={index} className="bg-white/10 text-white border border-white/20 rounded-xl p-4 flex justify-between items-center">
			<div>
				<p className="text-xl">{item.servicio}</p>
				<p className="text-sm text-white/70">{item.usuario}</p>
			</div>
			<button onClick={() => {setSelectedName(item);setShowInfoModal(true);}} className="text-white">
				<FaEllipsisV />
			</button>
			</div>
		))}
		</section>*/}

	  {showAddModal && (
		<div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
		  <div className="bg-white rounded-xl p-6 w-96 text-black shadow-lg space-y-4">
			<h2 className="text-xl font-semibold">Agregar Contraseña</h2>

			<div className="text-lg flex flex-col space-y-2">
			  <label htmlFor="name" className="text-lg">Servicio:</label>
			  <input id="name" type="text" className="border border-black rounded-md px-2 py-1 text-lg" />
			  <label htmlFor="name" className="text-lg">Usuario:</label>
			  <input id="name" type="text" className="border border-black rounded-md px-2 py-1 text-lg" />
			  <label htmlFor="password" className="text-lg">Contraseña:</label>
			  <div className="relative">
        		<input id="password" type={showPassword ? "text" : "password"} placeholder="Password" className="border border-black rounded-md text-lg px-2 py-1 pr-10 w-full text-black"/>
        		<span onClick={() => setShowPassword(!showPassword)}
          		className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600">
          		{showPassword ? <FaEyeSlash /> : <FaEye />}
        		</span>
      		  </div>
			  </div>
			<article className='flex justify-end items-center text-lg w-full space-x-2 px-4'>
              <button onClick={() => setShowEditModal(false)} className="bg-cyan-800 text-white px-4 py-1 rounded hover:bg-cyan-900">
                Guardar
              </button>
                <button onClick={() =>  setShowAddModal(false)} className="bg-cyan-800 text-white px-4 py-1 rounded hover:bg-cyan-800">
                  Cerrar
                </button>
            </article>
		  </div>
		</div>
	  )}

		{showInfoModal && (
		<div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
		  <div className="bg-white rounded-xl p-6 w-96 text-black shadow-lg space-y-4">
			<h2 className="text-xl font-semibold">Info de {selectedName?.name}</h2>
			<div className="flex flex-col space-y-2">
			  <label htmlFor="nameEdit" className="text-lg">User: {selectedName?.user}</label>
			  <div className="relative">
				<div className="flex items-center text-lg">
				<label htmlFor="passwordEdit" className="text-lg">Contraseña:</label>
					<div className="flex items-center justify-between pl-2">
						<input id="passwordEdit" type={showPassword ? "text" : "password"} value={selectedName?.password || ""} readOnly
						className="bg-transparent w-44"/>
						<span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer text-2xl pl-2">
						{showPassword ? <FaEyeSlash /> : <FaEye />}
						</span>
					</div>
				</div>
			  </div>
			  <label htmlFor="passwordEdit" className="text-lg">Creado: {selectedName?.aggregate} </label>
			  <label htmlFor="passwordEdit" className="text-lg">Modificado: {selectedName?.modified} </label>
			</div>
            <article className='flex justify-between items-center text-lg w-full'>
            <a href="" className='text-red-400 font-semibold hover:underline'>Eliminar</a>
            <div className='flex space-x-1'>
            <button onClick={() => setShowEditModal(true)} className="bg-cyan-800 text-white px-4 py-1 rounded hover:bg-cyan-900">
              Editar
            </button>
            <button onClick={() => setShowInfoModal(false)} className="bg-cyan-800 text-white px-4 py-1 rounded hover:bg-cyan-900">
              Cerrar
            </button>
            </div>
            </article>
		  </div>
		</div>
	  )}

	  {showEditModal && (
		<div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
		  <div className="bg-white rounded-xl p-6 w-96 text-black shadow-lg space-y-4">
			<h2 className="text-xl font-semibold">Editar: {selectedName?.name}</h2>
			<div className="text-xl flex flex-col space-y-2">
			  <label htmlFor="nameEdit" className="text-lg">User:</label>
			  <input id="nameEdit" type="text" placeholder={selectedName?.user} className="border border-black rounded-md px-2 py-1" />
			  <label htmlFor="passwordEdit" className="text-lg">Password:</label>
			  <input id="passwordEdit" type="text" placeholder={selectedName?.password} className="border border-black rounded-md px-2 py-1" />
			</div>
            <article className='flex justify-end items-center text-lg w-full space-x-2 px-4'>
            <button onClick={() => setShowEditModal(false)} className="bg-cyan-800 text-white px-4 py-1 rounded hover:bg-cyan-900">
              Guardar
            </button>
            <button onClick={() => setShowEditModal(false)} className="bg-cyan-800 text-white px-4 py-1 rounded hover:bg-cyan-900">
              Cerrar
            </button>
            </article>
		  </div>
		</div>
	  )}

	</div>
  )
}
