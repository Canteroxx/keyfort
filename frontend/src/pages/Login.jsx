import React from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de importar esto
import icon from '../assets/icon.png';

export default function Login() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-900"'>
     <div className="p-4 text-center text-white">
        <div className="mb-6 text-center">
          <img src={icon} alt="KeyFort Logo" className="w-80 h-80 mx-auto mb-2"/>
        </div>
        <article>
          <h2 className="text-xl font-semibold mb-4">Login</h2>
          <Link to="/Dashboard">
            <button className="px-4 py-2 text-base bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Login
            </button>
          </Link>
        </article>
      </div>
    </div>
  );
}
