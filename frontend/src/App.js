import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MenuAdmin from './components/MenuAdmin'
import Ajustes from './pages/Ajustes'
import Contraseñas from './pages/Contraseñas';
import Enviar from './pages/Enviar';
import Grupos from './pages/Grupos';
import Historial from './pages/Historial';
import AddUser from './pages/AddUser';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Solicitar from './pages/Solicitar';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/LostMyPassword" element={<Solicitar />} />

        <Route path="/" element={<MenuAdmin />} >
          <Route path="/Settings" element={<Ajustes />} />
          <Route path="/Passwords" element={<Contraseñas />} />
          <Route path="/GroupsFunctionals" element={<Grupos />} />
          <Route path="/AccessHistory" element={<Historial />} />
          <Route path="/Send" element={<Enviar />} />
          <Route path="/AddUser" element={<AddUser />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
