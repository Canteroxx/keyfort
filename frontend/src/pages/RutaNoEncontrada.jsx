import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RutaNoEncontrada = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const ultimaRuta = sessionStorage.getItem("ultima_ruta_valida");
    navigate(ultimaRuta || "/Login", { replace: true });
  }, [navigate]);

  return null; // O podrías mostrar un loader si quieres
};

export default RutaNoEncontrada;
