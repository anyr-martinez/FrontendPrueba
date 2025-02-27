import axios from "axios";
import { Servidor } from "../Configuration/ApiUrls";
import { DesEncriptar } from "../Encrypt/Crypto";


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
    try {
      const encryptedUser = sessionStorage.getItem("user");

      if (encryptedUser) {
        const decryptedUser = DesEncriptar(encryptedUser); 
        const user = JSON.parse(decryptedUser); 

        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
          console.log("Token enviado en el header:", user.token);
        } else {
          console.warn("No hay token disponible en el usuario.");
        }
      } else {
        console.warn(" No hay usuario en sessionStorage.");
      }
    } catch (error) {
      console.error("Error al obtener el usuario de sessionStorage:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Axios para imágenes
export const AxiosImagen = axios.create({
  baseURL: Servidor,
  timeout: 10000,
  headers: { 'Content-Type': 'multipart/form-data' }
});
