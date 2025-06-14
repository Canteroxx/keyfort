import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { tokenValido, obtenerDatosToken } from "../services/auth";


const PrivateRoute = ({ children, role }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const tokenEsValido = tokenValido();
  const datos = tokenEsValido ? obtenerDatosToken() : null;
  const rolCorrecto = role ? datos?.rol === role : true;

  useEffect(() => {
    if (!tokenEsValido) {
      navigate("/Login", { replace: true });
    } else if (tokenEsValido && rolCorrecto) {
      sessionStorage.setItem("ultima_ruta_valida", location.pathname);
    } else if (tokenEsValido && !rolCorrecto) {
      const rutaValida = sessionStorage.getItem("ultima_ruta_valida");
      navigate(rutaValida, { replace: true });
    }
  }, [tokenEsValido, rolCorrecto, location.pathname, navigate, datos]);

  if (!tokenEsValido || !rolCorrecto) return null;

  return children;
};

export default PrivateRoute;
