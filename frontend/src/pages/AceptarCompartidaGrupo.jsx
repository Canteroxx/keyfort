import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  validarTokenCompartida,
  verificarYaAceptadasGrupo,
  aceptarCompartidaGrupo,

} from "../services/service";

export default function AceptarCompartidaGrupo() {
  const { token } = useParams();
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [tokenValido, setTokenValido] = useState(null);
  const [bloquearAceptacion, setBloquearAceptacion] = useState(null);

  useEffect(() => {
    const validar = async () => {
      try {
        await validarTokenCompartida(token); 

        const verif = await verificarYaAceptadasGrupo(token);
        if (verif.todas_aceptadas) {
          setBloquearAceptacion(true);
          setMensaje("Ya has aceptado estas credenciales compartidas por el grupo.");
        } else {
          setBloquearAceptacion(false);
        }

        setTokenValido(true);
      } catch (err) {
        console.error("Error validando token:", err);
        setTokenValido(false);
        setMensaje("El enlace es inválido, ya fue usado o ha expirado.");
      }
    };

    validar();
  }, [token]);

  const aceptar = async () => {
    try {
      const res = await aceptarCompartidaGrupo(token, contrasena);
      setMensaje(res.mensaje || "Las credenciales del grupo se han aceptado correctamente.");
      setBloquearAceptacion(true); // Bloquear después de aceptar
    } catch (err) {
      console.error(err);
      setMensaje(err.response?.data?.error || "Error al aceptar las credenciales.");
    }
  };

  return (
    <div className="p-10 text-white text-xl">
      <h1 className="text-4xl mb-6">Aceptar credenciales compartidas por grupo</h1>

      {tokenValido === null && <p>Verificando enlace...</p>}

      {tokenValido === false && mensaje && (
        <p className="mt-4 text-red-400">{mensaje}</p>
      )}

      {tokenValido && bloquearAceptacion && (
        <p className="mt-4 text-yellow-400">{mensaje}</p>
      )}

      {tokenValido && !bloquearAceptacion && (
        <>
          <p className="mb-4">Ingresa tu contraseña para aceptar estas credenciales:</p>
          <input
            type="password"
            placeholder="Contraseña de inicio de sesión"
            value={contrasena}
            onChange={e => setContrasena(e.target.value)}
            className="p-2 rounded text-black mb-4 w-full max-w-md"
          />
          <br />
          <button onClick={aceptar} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
            Aceptar credenciales
          </button>
          {mensaje && <p className="mt-4 text-yellow-300">{mensaje}</p>}
        </>
      )}
    </div>
  );
}
