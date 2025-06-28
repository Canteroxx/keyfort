import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { tokenValido } from "../services/auth";

const PrivatePaso = ({ paso, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const usuarioIdStr = localStorage.getItem("usuario_id");
  const contrasenaTemporalStr = localStorage.getItem("contrasena_temporal");
  const verificado2FAStr = localStorage.getItem("verificado_2fa");

  const contrasenaTemporal = contrasenaTemporalStr === "true"; 
  const verificado2FA = verificado2FAStr === "true";
  console.log(contrasenaTemporal, verificado2FA, verificado2FAStr===null, localStorage.getItem("verificado_2fa"))

  const faltaDato = usuarioIdStr === null || contrasenaTemporalStr === null || verificado2FAStr === null;

  const noPermitido =
    tokenValido() ||
    (paso === "primerlogin" && (faltaDato || !contrasenaTemporal)) ||
    (paso === "conf2fa" && (faltaDato || contrasenaTemporal || verificado2FA)) ||
    (paso === "verificar2fa" && (faltaDato || contrasenaTemporal || !verificado2FA));

  useEffect(() => {
    if (faltaDato && ["primerlogin", "conf2fa", "verificar2fa"].includes(paso)) {
      navigate("/Login", { replace: true });
    } else if (noPermitido) {
      const rutaAnterior = sessionStorage.getItem("ultima_ruta_valida");
      navigate(rutaAnterior || "/", { replace: true });
    } else {
      sessionStorage.setItem("ultima_ruta_valida", location.pathname);
    }
  }, [noPermitido, faltaDato, paso, location.pathname, navigate]);

  if (noPermitido) return null; 

  return children;
};

export default PrivatePaso;
