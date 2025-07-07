{/* import { useState, useEffect } from 'react';
import { tokenValido, obtenerDatosToken } from '../../services/auth';
import { FaEllipsisV, FaEye, FaEyeSlash, FaAngleDown} from 'react-icons/fa';

export default function Ajustes() {
  const [error, setError] = useState('');
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const showPerfil = async () => {
      setError('');
      if (!tokenValido()) {
        setError('Token inválido o expirado');
        return;
      }
      const datos = obtenerDatosToken();
      if (!datos) {
        setError('No se pudo obtener la información del token');
        return;
      }
      console.log(datos);
      setUsuario(datos);
    };

    showPerfil();
  }, []);

  return (
    <div className='text-3xl p-10 font-mono w-full text-md font-mono transition-all relative'>
      <p className='p-10 text-5xl text-white'>Ajustes</p>
        <section className='p-10 text-3xl'>
          <p className='pb-4 text-4xl text-white'>Perfil</p>
          <div className='bg-white/5 p-4 rounded-2xl shadow-xl border border-white/10 text-white relative flex flex-row justify-between'>
          <p>Nombre:</p><p>{usuario?.nombre}</p>
          </div>
          <div className='bg-white/5 p-4 rounded-2xl shadow-xl border border-white/10 text-white relative flex flex-row justify-between'>
          <p>Correo:</p><p>{usuario?.correo}</p>
          </div>
          <div className='bg-white/5 p-4 rounded-2xl shadow-xl border border-white/10 text-white relative flex flex-row justify-between'>
          <p>Contraseña:</p><p><button><FaEyeSlash/></button></p>
          </div>
          <a className='text-2xl text-blue-400 font-semibold hover:underline' href="">cambiar contraseña</a>
        </section>
            
    <section className="p-10">
      <p className='pb-4 text-4xl text-white'>Apariencia</p>
        <div className="bg-white/5 text-3xl p-4 rounded-2xl shadow-xl border border-white/10 text-white relative flex flex-row justify-between">
        <p>Tema</p>
        <div className="relative">
          <select className="appearance-none bg-white/5 border border-white/30 text-white text-xl font-handwriting rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:white/5" >
            <option className="bg-[#1a1a1a] text-white" value="Dark">Dark</option>
            <option className="bg-[#1a1a1a] text-white" value="Light">Light</option>
            <option className="bg-[#1a1a1a] text-white" value="System">System</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white">
            <FaAngleDown />
          </div>
        </div>
      </div>
    </section>
    <article className='flex justify-between items-center text-lg w-full px-10'>
      <a href="#" className='text-red-400 font-semibold hover:underline'>Eliminar</a>
        <div className='flex space-x-3'>
          <button className="bg-cyan-800 text-white px-4 py-1 rounded hover:bg-cyan-800">
                  Guardar
          </button>
          </div>
      </article>
    </div>
  )
}
*/}

export default function Ajustes() {
    return (
    <div className='text-3xl p-10 font-mono w-full text-md font-mono transition-all relative'>
        <p className='p-10 text-6xl text-white'>Ajustes</p>
    </div>
  )
}