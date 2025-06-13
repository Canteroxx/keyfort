import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MenuAdmin from './components/MenuAdmin'
import Ajustes from './pages/admin/Ajustes'
import Contraseñas from './pages/admin/Contraseñas';
import Enviar from './pages/admin/Enviar';
import Grupos from './pages/admin/Grupos';
import Historial from './pages/admin/Historial';
import AddUser from './pages/admin/AddUser';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import Solicitar from './pages/Solicitar';
import PrimerLogin from './pages/PrimerLogin';
import Conf2FA from './pages/Conf2FA';
import Verificar2FA from './pages/Verificar2FA';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/LostMyPassword" element={<Solicitar />} />
        <Route path="/PrimerLogin" element={<PrimerLogin />}/>
        <Route path="/Conf2FA" element={<Conf2FA />}/>
        <Route path="/Verificar2FA" element={<Verificar2FA />}/>

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
