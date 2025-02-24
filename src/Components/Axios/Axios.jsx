import axios from "axios";
import { Servidor } from "../Configuration/ApiUrls";


// Axios público (sin autenticación)
export const AxiosPublico = axios.create({
  baseURL: Servidor,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Axios privado (con autenticación)
export const AxiosPrivado = axios.create({
  baseURL: Servidor,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor para agregar el token automáticamente
AxiosPrivado.interceptors.request.use(
  (config) => {
    const storedUser = JSON.parse(sessionStorage.getItem("user")); // Obtener usuario desde sessionStorage
    if (storedUser && storedUser.token) {
      config.headers.Authorization = `Bearer ${storedUser.token}`; // Inyectar token
      console.log("Token enviado en el header:", storedUser.token); // Verificación
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios para imágenes
export const AxiosImagen = axios.create({
  baseURL: Servidor,
  timeout: 10000,
  headers: { 'Content-Type': 'multipart/form-data' }
});
