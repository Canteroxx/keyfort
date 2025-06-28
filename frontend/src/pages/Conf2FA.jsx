import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { configurar2FA, verificarCodigo2FA } from '../services/service';
import icon from '../assets/icon.png';

export default function Conf2FA() {
  const [qrUri, setQrUri] = useState('');
  const [codigoSecreto, setCodigoSecreto] = useState('');
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const usuarioId = localStorage.getItem('usuario_id');
  
  useEffect(() => {
    const fetchQR = async () => {
      try {
        const uri = await configurar2FA(usuarioId);
        setQrUri(uri);

        const secret = new URLSearchParams(uri.split('?')[1]).get('secret');
        setCodigoSecreto(secret);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchQR();
  }, [usuarioId]);

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
  <div className="flex justify-center items-center min-h-screen bg-gray-900">
    <div className="absolute top-8">
      <img src={icon} alt="KeyFort Logo" className="w-64 h-64 mx-auto mb-4" />
    </div>
    <div className="bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10 w-[640px] text-white mt-48">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Configurar e Ingresar 2FA</h2>
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center mb-4">{error}</p>
      )}

      <div className="flex flex-col items-center space-y-4 mb-6">
        <p className="text-base">Escanea este código con tu app 2FA:</p>

        {qrUri ? (
          <>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUri)}`}
              alt="QR Code 2FA"
              className="rounded-lg border border-white/20"
            />
            <div className="text-base text-center text-gray-300 mt-2">
              <p className="font-semibold mb-1">¿No puedes escanear el código?</p>
              <p className="text-sm">Ingresa esta clave manualmente (basada en tiempo):</p>
              <p className="bg-gray-800 px-3 py-2 mt-2 rounded-md font-mono tracking-wider text-2xl text-white border border-white/10">
                {codigoSecreto}
              </p>
            </div>
          </>
        ) : (
          <p className="text-gray-400">Generando código QR...</p>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <label htmlFor="codigo2fa" className="text-base font-medium">Ingresa el código de 6 dígitos</label>
        <input
          id="codigo2fa"
          type="text"
          maxLength={6}
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
          placeholder="TOTP"
          className="w-full px-4 py-2 rounded-md bg-white text-black placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleVerificar}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition text-white rounded-md font-semibold"
        >
          Verificar
        </button>
      </div>
    </div>
  </div>
);

}
