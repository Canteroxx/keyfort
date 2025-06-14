import { jwtDecode } from "jwt-decode";

export function tokenValido() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const ahora = Date.now() / 1000;
    return decoded.exp > ahora;
  } catch (e) {
    return false;
  }
}

export function obtenerDatosToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
}

