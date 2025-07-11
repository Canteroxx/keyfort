import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import icon from '../assets/icon.png';
import { loginUsuario } from '../services/service';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await loginUsuario(correo, contrasena);

      localStorage.setItem('usuario_id', data.usuario);
      localStorage.setItem('contrasena_temporal', data.contrasena_temporal);
      localStorage.setItem('verificado_2fa', data.verificado_2fa);

      if (data.contrasena_temporal) {
        navigate('/PrimerLogin');
      } else if (!data.verificado_2fa) {
        navigate('/Conf2FA');
      } else {
        navigate('/Verificar2FA');
      }
    } catch (error) {
      alert(error.message);
    }
  };


  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-900'>
      <div className="absolute top-8">
        <img src={icon} alt="KeyFort Logo" className="w-64 h-64 mx-auto mb-4" />
      </div>
      <div className="bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10 w-[640px] text-white mt-40">
        <article className='mb-6"'>
          <h2 className="text-center text-xl font-semibold mb-4">Iniciar Sesión</h2>
          <div className="text-xl flex flex-col space-y-2">
            <label htmlFor="correo" className="text-lg">Correo:</label>
            <input
              id="correo"
              type="text"
              placeholder="Correo"
              className="border border-black rounded-md px-2 py-1 text-black"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
            />
            <label htmlFor="contrasena" className="text-lg">Contraseña:</label>
            <input
              id="contrasena"
              type="password"
              placeholder="Contraseña"
              className="border border-black rounded-md px-2 py-1 text-black"
              value={contrasena}
              onChange={e => setContrasena(e.target.value)}
            />
          </div>
          <a href="/LostMyPassword" className="inline text-lg text-cyan-500 hover:underline">Olvidé mi contraseña</a>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleLogin}
              className="px-4 py-2 text-base bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Iniciar Sesion
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
