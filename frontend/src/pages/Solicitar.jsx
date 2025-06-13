import React from 'react'
import { Link } from 'react-router-dom'; 
import icon from '../assets/icon.png';

export default function Solicitar() {
  return (
    <div className='flex justify-center min-h-screen bg-gray-900"'>
     <div className="p-4 text-white">
        <div className="mb-6 text-center">
          <img src={icon} alt="KeyFort Logo" className="w-80 h-80 mx-auto mb-2"/>
        </div>
        <article className='bg-gray-900 p-12 rounded-md border w-[600px] max-w-full transition-all relative'>
          <h2 className="text-center text-xl font-semibold mb-4">Solicitar Nueva contraseña</h2>
            <div className="text-xl flex flex-col space-y-2">
              <label htmlFor="nameEdit" className="text-lg">Ingrese su Correo:</label>
              <input id="nameEdit" type="text" placeholder='Name' className="border border-black rounded-md px-2 py-1 text-black" />
            </div>
            <a href="/Login" className='inline text-lg text-cyan-500 hover:underline'>Iniciar Sesion</a>
            <div className="flex justify-end">
              <Link to="/Login">
                <button className="px-4 py-2 text-base bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  Enviar
                </button>
              </Link>
            </div>
        </article>
      </div>
    </div>
  );
}
