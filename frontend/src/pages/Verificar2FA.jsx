import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificarCodigo2FA } from '../services/service';
import { jwtDecode } from 'jwt-decode';
import icon from '../assets/icon.png';

export default function Verificar2FA() {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const usuarioId = localStorage.getItem('usuario_id');

  const handleVerificar = async () => {
    setError('');

    if (!codigo || codigo.length !== 6) {
      setError('Por favor ingresa un código válido de 6 dígitos');
      return;
    }

    try {
      const token = await verificarCodigo2FA(usuarioId, codigo);
      localStorage.setItem('token', token);
      localStorage.removeItem('usuario_id');
      localStorage.removeItem('contrasena_temporal');
      localStorage.removeItem('verificado_2fa');

      const payload = jwtDecode(token);
      if (payload.rol === 'Admin') {
        navigate('/Dashboard');
      } else if (payload.rol === 'Usuario') {
        navigate('/PasswordsUser');
      } else {
        alert('Tu rol no está autorizado para acceder al sistema.');
      }
    } catch (error) {
      setError(error.message);
    }
  };


  return (
    <div className='flex justify-center min-h-screen bg-gray-900'>
      <div className="p-4 text-white">
        <div className="mb-6 text-center">
          <img src={icon} alt="KeyFort Logo" className="w-80 h-80 mx-auto mb-2" />
        </div>
        <article className='bg-gray-900 p-12 rounded-md border w-[600px] max-w-full transition-all relative'>
          <h2 className="text-center text-xl font-semibold mb-4">Ingresa el Código de 6 Dígitos</h2>

          <div className="text-xl flex flex-col space-y-2">
            <label htmlFor="codigo2fa" className="text-lg">Código de 6 dígitos</label>
            <input
              id="codigo2fa"
              type="text"
              maxLength={6}
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              className="border border-black rounded-md px-2 py-1 text-black"
              placeholder='TOTP'
            />
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <div className="flex justify-end mt-4">
            <button
              onClick={handleVerificar}
              className="px-4 py-2 text-base bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Verificar
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
