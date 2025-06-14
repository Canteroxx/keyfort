import React from 'react';
import { Link, Outlet, useLocation, useNavigate} from 'react-router-dom';
import { useState } from 'react';

import {
  FaKey,
  FaUsers,
  FaClock,
  FaPaperPlane,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaPlus,
  FaTimes,
  FaDesktop,
} from 'react-icons/fa';
import icon from '../assets/icon.png';

export default function MenUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const toggleMenu = () => setIsOpen(!isOpen);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/Login');
  };

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-2 rounded-md text-white transition ${
      location.pathname === path
        ? 'bg-cyan-700 border border-cyan-300'
        : 'hover:bg-cyan-800'
    }`;

  return (
    <div className="flex min-h-screen">
		<button
		onClick={toggleMenu}
		className="fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-md shadow-md hover:bg-gray-700 transition"
		>
		{isOpen ? <FaTimes /> : <FaBars />}
		</button>
		  <aside
    className={`fixed top-0 left-0 h-screen bg-gray-900 text-white p-4 shadow-md flex flex-col items-center transition-all duration-300 ease-in-out z-40 ${
      isOpen ? 'w-64' : 'w-0 overflow-hidden'
    }`}
  >
        <div className="mb-6 text-center">
          <img src={icon} alt="KeyFort Logo" className="w-40 h-40 mx-auto mb-2"/>
        </div>
		<nav className={`flex flex-col w-full space-y-2 text-md font-medium transition-all ${isOpen ? 'block' : 'hidden'}`}>
          <Link to="/PasswordsUser" className={linkClass('/Passwords')}>
            <FaKey />
            <span>Contraseñas</span>
          </Link>
          <Link to="/Groups" className={linkClass('/Groups')}>
            <FaUsers />
            <span>Grupos</span>
          </Link>
          <Link to="/Send" className={linkClass('/Send')}>
            <FaPaperPlane />
            <span>Enviar Contraseña</span>
          </Link>
            <Link to="/UserAccessHistory" className={linkClass('/AccessHistory')}>
            <FaClock />
            <span>Historial de acceso</span>
          </Link>
          <Link to="/Settings" className={linkClass('/Settings')}>
            <FaCog />
            <span>Ajustes</span>
          </Link>
          <button onClick={cerrarSesion} className={linkClass('')}>
            <FaSignOutAlt />
            <span>Cerrar Sesión</span>
          </button>
        </nav>
      </aside>
      <main
        className={`flex-1 bg-grisFondo p-6 transition-all duration-300 ${
          isOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
