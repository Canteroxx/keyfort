// src/pages/Primer_Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enviarPrimerLogin } from '../services/service';;
import icon from '../assets/icon.png';
import useAuthBoolean from '../services/useAuthBoolean';

export default function Primer_Login() {
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const usuarioId = localStorage.getItem('usuario_id');
  const usuario = useAuthBoolean(true, false);
  const handleGuardar = async () => {
    setError('');

    if (!contrasena || !confirmar || contrasena !== confirmar) {
      setError('Las contraseñas no coinciden o están vacías');
      return;
    }

    try {
      await enviarPrimerLogin({
        usuario_id: usuarioId,
        nueva_contrasena: contrasena
      });

      navigate('/Conf2FA');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMantener = async () => {
    setError('');

    try {
      await enviarPrimerLogin({
        usuario_id: usuarioId,
        mantener_contrasena: true
      });

      navigate('/Conf2FA');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='flex justify-center min-h-screen bg-gray-900'>
      <div className="p-4 text-white">
        <div className="mb-6 text-center">
          <img src={icon} alt="KeyFort Logo" className="w-80 h-80 mx-auto mb-2" />
        </div>
        <article className='bg-gray-900 p-12 rounded-md border w-[600px] max-w-full transition-all relative'>
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
              className="px-4 py-2 text-base bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
            >
              Mantener Contraseña
            </button>
            <button
              onClick={handleGuardar}
              className="px-4 py-2 text-base bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Guardar
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
