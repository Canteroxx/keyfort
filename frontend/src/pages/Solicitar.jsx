import React from 'react'
import { Link } from 'react-router-dom'; 
import icon from '../assets/icon.png';

export default function Solicitar() {
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-900'>
      <div className="absolute top-8">
        <img src={icon} alt="KeyFort Logo" className="w-64 h-64 mx-auto mb-4" />
      </div>
        <article className='bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10 w-[640px] text-white mt-20'>
          <h2 className="text-center text-xl font-semibold mb-4">Olvidaste tu Contraseña</h2>
            <div className="text-xl flex flex-col space-y-2">
              <label htmlFor="nameEdit" className="text-lg">En Proceso ...</label>
            </div>
            <div className="flex justify-end">
              <Link to="/Login">
                <button className="px-4 py-2 text-base bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  Volver Al Login
                </button>
              </Link>
            </div>
        </article>
      </div>
  );
}
