import { Routes, Route, Navigate } from "react-router-dom";
import MenuAdmin from "./components/MenuAdmin";
import MenUser from "./components/MenUser";
import PrivateRoute from "./components/PrivateRoute";
import PrivatePaso from "./components/PrivatePaso";

import Ajustes from "./pages/admin/Ajustes";
import Contraseñas from "./pages/admin/Contraseñas";
import Enviar from "./pages/admin/Enviar";
import Grupos from "./pages/admin/Grupos";
import Historial from "./pages/admin/Historial";
import AddUser from "./pages/admin/AddUser";
import Dashboard from "./pages/admin/Dashboard";
import Passwords from "./pages/user/Passwords";

import Login from "./pages/Login";
import Solicitar from "./pages/Solicitar";
import PrimerLogin from "./pages/PrimerLogin";
import Conf2FA from "./pages/Conf2FA";
import Verificar2FA from "./pages/Verificar2FA";
import RutaNoEncontrada from "./pages/RutaNoEncontrada";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Login" />} />
      <Route path="/LostMyPassword" element={<Solicitar />} />

      <Route path="/Login" element={
        <PrivatePaso paso={null}>
          <Login />
        </PrivatePaso>
      } />

      <Route path="/PrimerLogin" element={
        <PrivatePaso paso="primerlogin">
          <PrimerLogin />
        </PrivatePaso>
      } />

      <Route path="/Conf2FA" element={
        <PrivatePaso paso="conf2fa">
          <Conf2FA />
        </PrivatePaso>
      } />

      <Route path="/Verificar2FA" element={
        <PrivatePaso paso="verificar2fa">
          <Verificar2FA />
        </PrivatePaso>
      } />

      <Route path="/" element={
        <PrivateRoute role="Admin">
          <MenuAdmin />
        </PrivateRoute>
      }>
        <Route path="Dashboard" element={<Dashboard />} />
        <Route path="Settings" element={<Ajustes />} />
        <Route path="Passwords" element={<Contraseñas />} />
        <Route path="GroupsFunctionals" element={<Grupos />} />
        <Route path="AccessHistory" element={<Historial />} />
        <Route path="Send" element={<Enviar />} />
        <Route path="AddUser" element={<AddUser />} />
      </Route>

      <Route path="/" element={
        <PrivateRoute role="Usuario">
          <MenUser />
        </PrivateRoute>
      }>
        <Route path="PasswordsUser" element={<Passwords />} />
      </Route>

      <Route path="*" element={<RutaNoEncontrada />} />
    </Routes>
  );
}


export default App;
