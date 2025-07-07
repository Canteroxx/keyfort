{/* import { useState, useEffect } from 'react';
export default function Dashboard() {
  const [totalCredenciales, setTotalCredenciales] = useState(0);

  useEffect(() => {
    const contarTodas = async () => {
      try {
        const todas = await obtenerTodasLasCredenciales();
        setTotalCredenciales(todas.length);
      } catch (err) {
        console.error('Error al contar todas las contraseñas:', err.message);
      }
    };

  contarTodas();
  }, []);

  return (
    <div className="text-3xl p-10 font-handwriting w-full text-md font-medium transition-all relative text-white">
      <h1 className="p-10 text-5xl">Panel de control</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white/5 p-6 rounded-xl shadow-md text-center">
          <p className="text-xl">Contraseñas</p>
          <p className="text-5xl mt-2 font-bold">0</p>
        </div>
        <div className="bg-white/5 p-6 rounded-xl shadow-md text-center">
          <p className="text-xl">Grupos Funcionando</p>
          <p className="text-5xl mt-2 font-bold">0</p>
        </div>
        <div className="bg-white/5 p-6 rounded-xl shadow-md text-center">
          <p className="text-xl">Usuarios</p>
          <p className="text-5xl mt-2 font-bold">0</p>
        </div>
        <div className="bg-white/5 p-6 rounded-xl shadow-md text-center">
          <p className="text-xl">Accesos en las últimas 24 horas</p>
          <p className="text-5xl mt-2 font-bold">0</p>
        </div>
      </div>

      <div className="bg-white/5 p-6 rounded-xl shadow-md">
        <p className="text-3xl mb-4">Historial de accesos</p>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left text-xl">
            <thead>
              <tr className="border-b border-white/20">
                <th className="pb-2">Fecha</th>
                <th className="pb-2">Hora</th>
                <th className="pb-2">Usuario</th>
                <th className="pb-2">Contraseña</th>
              </tr>
            </thead>
                <tbody>
              {historialAccesos.map((item, index) => (
                <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition">
                  <td className="py-2">{item.fecha}</td>
                  <td>{item.hora}</td>
                  <td>{item.usuario}</td>
                  <td>{item.servicio}</td>
                </tr>
              ))}
            </tbody> 

          </table>
        </div>
      </div>
    </div>
  );
}
*/}

export default function Dashboard() {
    return (
    <div className='text-3xl p-10 font-mono w-full text-md font-mono transition-all relative'>
        <p className='p-10 text-5xl text-white'>Dashboard</p>
    </div>
  )
}