// src/pages/Primer_Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enviarPrimerLogin } from '../services/service';;
import icon from '../assets/icon.png';

export default function Primer_Login() {
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const usuarioId = localStorage.getItem('usuario_id');
  const handleGuardar = async () => {
    setError('');

    if (!contrasena || !confirmar || contrasena !== confirmar) {
      setError('Las contraseñas no coinciden o están vacías');
      return;
    }

    try {
      const data = await enviarPrimerLogin({
        usuario_id: usuarioId,
        nueva_contrasena: contrasena
      });
      localStorage.setItem('contrasena_temporal', data.contrasena_temporal);

      if(!data.contrasena_temporal){
        navigate('/Conf2FA');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleMantener = async () => {
    setError('');

    try {
      const data = await enviarPrimerLogin({
        usuario_id: usuarioId,
        mantener_contrasena: true
      });

      localStorage.setItem('contrasena_temporal', data.contrasena_temporal);
      
      if(!data.contrasena_temporal){
        navigate('/Conf2FA');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-900'>
    <div className="absolute top-8">
        <img src={icon} alt="KeyFort Logo" className="w-64 h-64 mx-auto mb-4" />
      </div>
        <article className='bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10 w-[640px] text-white mt-40'>
          <h2 className="text-center text-xl font-semibold mb-4">Cambiar Contraseña</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="text-xl flex flex-col space-y-2">
            <label className="text-lg">Nueva contraseña:</label>
            <input
              type="password"
              value={contrasena}
              onChange={e => setContrasena(e.target.value)}
              className="border border-black rounded-md px-2 py-1 text-black"
              placeholder='Contraseña'
            />
            <label className="text-lg">Confirmar contraseña:</label>
            <input
              type="password"
              value={confirmar}
              onChange={e => setConfirmar(e.target.value)}
              className="border border-black rounded-md px-2 py-1 text-black"
              placeholder='Repite la contraseña'
            />
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={handleMantener}
              className="px-4 py-2 text-base bg-gray-500 hover:bg-gray-600 text-white rounded transition"
            >
              Mantener Contraseña
            </button>
            <button
              onClick={handleGuardar}
              className="px-4 py-2 text-base bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Cambiar Contraseña
            </button>
          </div>
        </article>
      </div>
  );
}
