import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaEye, FaEyeSlash, FaCopy } from "react-icons/fa";
import ba from '../../assets/ba.png';
import bc from '../../assets/bc.png';
import {
  crearCredencial,
  obtenerMisCredenciales,
  verCredencial,
  eliminarCredencial,
} from "../../services/service";
import { obtenerDatosToken } from "../../services/auth";

export default function Contraseñas() {
  const [servicio, setServicio] = useState("");
  const [usuarioServicio, setUsuarioServicio] = useState("");
  const [contrasenaServicio, setContrasenaServicio] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [codigo2FA, setCodigo2FA] = useState("");
  const [mostrandoCredencial, setMostrandoCredencial] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedName, setSelectedName] = useState(null);
  const [passwords, setPasswords] = useState([]);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const timerRef = useRef(null);

  const cargarCredenciales = async () => {
    try {
      const datosToken = obtenerDatosToken();
      if (!datosToken) throw new Error("Token inválido o expirado");
      const usuario_id = datosToken.usuario_id;

      const res = await obtenerMisCredenciales(usuario_id);
      setPasswords(res);
    } catch (err) {
      alert("Error al cargar credenciales: " + err.message);
    }
  };

  useEffect(() => {
    cargarCredenciales();
  }, []);

  useEffect(() => {
    if (mostrandoCredencial) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setMostrandoCredencial(false);
        setSelectedName(null);
        setPasswordLogin("");
        setCodigo2FA("");
        setShowPassword(false);
        setShowDeleteForm(false);
        setTimeout(() => {
          alert("La visualización de la credencial expiró por seguridad.");
        }, 100);
      }, 30000);
      return () => clearTimeout(timerRef.current);
    }
  }, [mostrandoCredencial]);

  const handleGuardarCredencial = async () => {
    if (!passwordLogin || !servicio || !usuarioServicio || !contrasenaServicio) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }
    try {
      const datosToken = obtenerDatosToken();
      const id = datosToken.usuario_id;

      await crearCredencial(
        id,
        servicio,
        usuarioServicio,
        contrasenaServicio,
        passwordLogin
      );
      alert("Contraseña creada exitosamente");
      setShowAddModal(false);
      setServicio("");
      setUsuarioServicio("");
      setContrasenaServicio("");
      setPasswordLogin("");
      await cargarCredenciales();
    } catch (err) {
      alert("Error al guardar contraseña: " + err.message);
    }
  };

  const handleVerCredencial = async () => {
    if (!passwordLogin || !codigo2FA) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }
    try {
      const datosToken = obtenerDatosToken();
      const usuario_id = datosToken.usuario_id;

      const response = await verCredencial({
        usuario_id,
        credencial_id: selectedName.id,
        contrasena_usuario: passwordLogin,
        codigo_2fa: codigo2FA,
      });
      setSelectedName({
        ...selectedName,
        user: response.usuario,
        password: response.contrasena,
      });
      setMostrandoCredencial(true);
      setShowDeleteForm(false);
    } catch (error) {
      alert("Error al mostrar contraseña: " + error.message);
    }
  };

  const handleEliminarCredencial = async () => {
    if (!passwordLogin || !codigo2FA) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }
    try {
      const datosToken = obtenerDatosToken();
      const usuario_id = datosToken.usuario_id;

      await eliminarCredencial({
        usuario_id,
        credencial_id: selectedName.id,
        contrasena_usuario: passwordLogin,
        codigo_2fa: codigo2FA,
      });

      alert("Contraseña eliminada exitosamente");
      setShowDeleteForm(false);
      setMostrandoCredencial(false);
      setPasswordLogin("");
      setCodigo2FA("");
      setSelectedName(null);
      await cargarCredenciales();
    } catch (error) {
      alert("Error al eliminar contraseña: " + error.message);
    }
  };

  const copiarAlPortapapeles = (text, campo) => {
    navigator.clipboard.writeText(text);
    setCopiedField(campo);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="text-3xl p-10 font-handwriting w-full text-md font-medium transition-all relative">
      <p className="p-10 text-5xl text-white">Contraseñas</p>
      <nav className="justify-items-end px-5 pb-5">
        <button
          onClick={() => {
            setShowAddModal(true);
            setMostrandoCredencial(false);
            setPasswordLogin("");
            setCodigo2FA("");
            setServicio("");
            setUsuarioServicio("");
            setContrasenaServicio("");
            setSelectedName(null);
            setShowDeleteForm(false);
          }}
          className="flex flex-row items-center gap-3 px-4 py-2 rounded-md text-white text-xl bg-cyan-700 border border-cyan-300 hover:bg-cyan-800"
        >
          <FaPlus />
          <span>Add Password</span>
        </button>
      </nav>

      <section className="text-3xl">
        {passwords.map((item, index) => {
          const isSelected = selectedName?.id === item.id;
          return (
            <div
              key={index}
              className="bg-white/10 mb-2 text-white border border-white/10 rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex justify-between items-center">
                <p className="">Servicio: {item.servicio}</p>
                <div className="flex gap-2 text-white text-2xl">
                  <button
                    className=""
                    onClick={() => {
                      if (isSelected && !showDeleteForm) {
                        setSelectedName(null);
                        setMostrandoCredencial(false);
                        setPasswordLogin("");
                        setCodigo2FA("");
                        setShowDeleteForm(false);
                      } else {
                        setSelectedName(item);
                        setMostrandoCredencial(false);
                        setPasswordLogin("");
                        setCodigo2FA("");
                        setShowPassword(false);
                        setShowDeleteForm(false);
                      }
                    }}
                  >
                    {isSelected && !showDeleteForm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button
                    className="text-600 text-2xl"
                    title="Eliminar credencial"
                    onClick={() => {
                      if (isSelected && showDeleteForm) {
                        setSelectedName(null);
                        setShowDeleteForm(false);
                      } else {
                        setSelectedName(item);
                        setMostrandoCredencial(false);
                        setShowDeleteForm(true);
                        setPasswordLogin("");
                        setCodigo2FA("");
                        setShowPassword(false);
                      }
                    }}
                  >
                    {isSelected && showDeleteForm ? <img src={ba} alt="ba icon" className="w-6 h-6 invert"/> : <img src={bc} alt="bc icon" className="w-6 h-6 invert"/>}
                  </button>
                </div>
              </div>

              {isSelected && !mostrandoCredencial && (
                <div className="flex flex-col space-y-2 text-lg">
                  <input
                    type="password"
                    placeholder="Contraseña Login"
                    value={passwordLogin}
                    onChange={(e) => setPasswordLogin(e.target.value)}
                    className="border border-white bg-transparent text-white rounded-md px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Código 2FA"
                    value={codigo2FA}
                    onChange={(e) => setCodigo2FA(e.target.value)}
                    className="border border-white bg-transparent text-white rounded-md px-3 py-2"
                  />

                  {!showDeleteForm ? (
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={handleVerCredencial}
                        className="bg-cyan-800 text-white px-4 py-2 rounded hover:bg-cyan-900"
                      >
                        Ver contraseña
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={handleEliminarCredencial}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Eliminar contraseña
                      </button>
                    </div>
                  )}
                </div>
              )}

              {isSelected && mostrandoCredencial && (
                <div className="flex flex-col space-y-2 text-lg">
                  <div className="flex items-center gap-2">
                    <label className="text-white">Usuario:</label>
                    <input
                      type="text"
                      value={selectedName.user || ""}
                      readOnly
                      className="w-full border border-white bg-transparent text-white rounded-md px-3 py-2"
                    />
                    <button
                      onClick={() =>
                        copiarAlPortapapeles(selectedName.user || "", "usuario")
                      }
                      title="Copiar usuario"
                      className="text-white hover:text-cyan-300"
                    >
                      <FaCopy />
                    </button>
                    {copiedField === "usuario" && (
                      <span className="text-cyan-300 ml-2">¡Copiado!</span>
                    )}
                  </div>
                  <div className="relative flex items-center gap-2">
                    <label className="text-white">Contraseña:</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={selectedName.password || ""}
                      readOnly
                      className="w-full border border-white bg-transparent text-white rounded-md px-3 py-2 pr-10"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-8 top-3 cursor-pointer text-white"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    <button
                      onClick={() =>
                        copiarAlPortapapeles(selectedName.password || "", "password")
                      }
                      title="Copiar contraseña"
                      className="text-white hover:text-cyan-300"
                    >
                      <FaCopy />
                    </button>
                    {copiedField === "password" && (
                      <span className="text-cyan-300 ml-2">¡Copiado!</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 text-black shadow-lg space-y-4">
            <h2 className="text-xl font-semibold">Agregar Contraseña</h2>
            <div className="text-lg flex flex-col space-y-2">
              <label htmlFor="servicio" className="text-lg">Servicio:</label>
              <input
                id="servicio"
                type="text"
                value={servicio}
                onChange={(e) => setServicio(e.target.value)}
                className="border border-black rounded-md px-2 py-1 text-lg"
              />
              <label htmlFor="usuarioServicio" className="text-lg">Usuario Servicio:</label>
              <input
                id="usuarioServicio"
                type="text"
                value={usuarioServicio}
                onChange={(e) => setUsuarioServicio(e.target.value)}
                className="border border-black rounded-md px-2 py-1 text-lg"
              />
              <label htmlFor="contrasenaServicio" className="text-lg">Contraseña Servicio:</label>
              <div className="relative">
                <input
                  id="contrasenaServicio"
                  type={showPassword1 ? "text" : "password"}
                  value={contrasenaServicio}
                  onChange={(e) => setContrasenaServicio(e.target.value)}
                  className="border border-black text-lg px-2 py-1 pr-10 w-full text-black rounded-md"
                />
                <span
                  onClick={() => setShowPassword1(!showPassword1)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                >
                  {showPassword1 ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <label htmlFor="passwordLogin" className="text-lg">Contraseña Login:</label>
              <div className="relative">
                <input
                  id="passwordLogin"
                  type={showPassword2 ? "text" : "password"}
                  value={passwordLogin}
                  onChange={(e) => setPasswordLogin(e.target.value)}
                  className="border border-black text-lg px-2 py-1 pr-10 w-full text-black rounded-md"
                />
                <span
                  onClick={() => setShowPassword2(!showPassword2)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                >
                  {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <article className="flex justify-end items-center text-lg w-full space-x-2 px-4">
              <button
                onClick={handleGuardarCredencial}
                className="bg-cyan-800 text-white px-4 py-1 rounded hover:bg-cyan-900"
              >
                Guardar
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-cyan-800 text-white px-4 py-1 rounded hover:bg-cyan-800"
              >
                Cerrar
              </button>
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
