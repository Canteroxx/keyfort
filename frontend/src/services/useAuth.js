import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function useAuth(rolEsperado = null) {
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

    if (rolEsperado && payload.rol !== rolEsperado) {
        navigate('/AccesoDenegado');
		    return;
      }

    } catch (error) {
      localStorage.removeItem('token');
      navigate('/Login');
    }
  }, [rolEsperado]);

  return usuario;
}
