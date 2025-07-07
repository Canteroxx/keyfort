{/*import React, { useEffect, useState } from 'react';
import { obtenerGruposConCredenciales } from '../../services/service';
import { obtenerDatosToken } from "../../services/auth";

export default function Groups() {
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const datosToken = obtenerDatosToken();
        const id = datosToken.usuario_id;
        const data = await obtenerGruposConCredenciales(id);
        setGrupos(data);
      } catch (err) {
        alert("Error al obtener grupos: " + err.message);
      }
    };

    fetchGrupos();
  }, []);

  return (
    <div className='text-white p-10 font-mono w-full'>
      <h1 className='text-6xl mb-10'>Grupos</h1>

      {grupos.length === 0 ? (
        <p className="text-lg italic">No estás en ningún grupo o no tienes credenciales compartidas.</p>
      ) : (
        grupos.map((grupo) => (
          <div key={grupo.grupo_id} className="bg-[#222d3d] p-6 mb-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold mb-4">{grupo.nombre}</h2>
            {grupo.credenciales.length === 0 ? (
              <p className="text-lg italic">No tienes credenciales compartidas en este grupo.</p>
            ) : (
              <ul className="space-y-2">
                {grupo.credenciales.map((cred, idx) => (
                  <li key={idx} className="bg-[#2e3c4f] px-4 py-2 rounded">
                    <p><strong>Usuario cifrado:</strong> {cred.usuario_cifrado}</p>
                    <p><strong>Contraseña cifrada:</strong> {cred.contrasena_cifrada}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
}
*/}  

export default function Groups() {  
  return (
    <div className='text-3xl p-10 font-mono w-full text-md font-mono transition-all relative'>
        <p className='p-10 text-6xl text-white'>Grupos</p>
    </div>
  )
}