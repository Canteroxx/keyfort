import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function useAuthBoolean(Verificado = false, SinClaveTemporal = false) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/Login');
      return;
    }

    try {
      const payload = jwtDecode(token);
      setUsuario(payload);

	  if (Verificado && payload.verificado_2fa === true) {
        navigate('/AccesoDenegado');
        return;
      }

      if (ClaveTemporal && payload.contrasena_temporal === false) {
        navigate('/AccesoDenegado');
        return;
      }
    } catch (error) {
      localStorage.removeItem('token');
      navigate('/Login');
    }
  }, [Verificado, SinClaveTemporal]);

  return usuario;
}
