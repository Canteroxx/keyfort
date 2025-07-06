import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  aceptarCompartida,
  validarTokenCompartida,
  verificarYaAceptadas
} from "../services/service";

export default function AceptarCompartida() {
  const { token } = useParams();
  const tokenDecodificado = decodeURIComponent(token);

  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [tokenValido, setTokenValido] = useState(null);
  const [bloquearAceptacion, setBloquearAceptacion] = useState(null);

  useEffect(() => {
    const validar = async () => {
      try {
        await validarTokenCompartida(tokenDecodificado); // Verifica expiración/uso

        // Extraer el contenido del token (cuidado: puede fallar si el token no es JWT base64)
        const datos = JSON.parse(tokenDecodificado.split('.')[0]);
        console.log(datos);
        const { usuario_id, credenciales_ids } = datos;

        const verif = await verificarYaAceptadas({ usuario_id, credenciales_ids });
        if (verif.todas_aceptadas) {
          setBloquearAceptacion(true);
          setMensaje("Estas credenciales ya fueron aceptadas.");
        } else {
          setBloquearAceptacion(false);
        }

        setTokenValido(true);
      } catch (err) {
        setTokenValido(false);
        setMensaje("Enlace usado, inválido o expirado.");
      }
    };

    validar();
  }, [tokenDecodificado]);

  const aceptar = async () => {
    try {
      const res = await aceptarCompartida(tokenDecodificado, contrasena);
      setMensaje(res.mensaje || "Credencial compartida correctamente.");
      setBloquearAceptacion(true); // Bloquear después de aceptar
    } catch (err) {
      setMensaje(err.response?.data?.error || "Error al aceptar credencial.");
    }
  };

  return (
    <div className="p-10 text-white text-xl">
      <h1 className="text-4xl mb-6">Aceptar credencial compartida</h1>

      {tokenValido === null && <p>Verificando enlace...</p>}

      {tokenValido === false && mensaje && (
        <p className="mt-4 text-red-400">{mensaje}</p>
      )}

      {tokenValido && bloquearAceptacion && (
        <p className="mt-4 text-yellow-400">{mensaje}</p>
      )}

      {tokenValido && !bloquearAceptacion && (
        <>
          <p className="mb-4">Introduce tu contraseña para completar el proceso:</p>
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={e => setContrasena(e.target.value)}
            className="p-2 rounded text-black mb-4 w-full max-w-md"
          />
          <br />
          <button onClick={aceptar} className="bg-blue-600 px-4 py-2 rounded">
            Aceptar
          </button>
          {mensaje && <p className="mt-4 text-yellow-300">{mensaje}</p>}
        </>
      )}
    </div>
  );
}
