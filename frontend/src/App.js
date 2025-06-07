import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from './components/Menu'
import Ajustes from './pages/Ajustes'
import Contraseñas from './pages/Contraseñas';
import Enviar from './pages/Enviar';
import Grupos from './pages/Grupos';
import Historial from './pages/Historial';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Menu />} >
         <Route path="/Settings" element={<Ajustes />} />
         <Route path="/Passwords" element={<Contraseñas />} />
         <Route path="/Groups" element={<Grupos />} />
         <Route path="/AccessHistory" element={<Historial />} />
         <Route path="/Send" element={<Enviar />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
