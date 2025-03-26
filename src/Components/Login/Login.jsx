import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import fondo from "../../assets/images/fondo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { UsuarioIniciarSesion } from "../Configuration/ApiUrls";
import { AxiosPublico } from "../Axios/Axios";
import {
  mostrarAlerta,
  mostrarAlertaOK,
  mostrarAlertaError,
} from "../SweetAlert/SweetAlert";
import { UserContext } from "../Context/user/UserContext";
import { useSessionStorage } from "../Context/storage/useSessionStorage";
import useSpecialLogin from "../../hooks/useSpecialLogin"; 

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setPassword] = useState("");
  const navigate = useNavigate();
  const { setLogin } = useContext(UserContext);
  const [, setStoredUser] = useSessionStorage("user", usuario);
  const { checkSpecialLogin } = useSpecialLogin();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!usuario || !contrasena) {
      mostrarAlerta("Por favor, complete todos los campos.", "warning");
      return;
    }
  
    if (checkSpecialLogin(usuario, contrasena)) {
      return;
    }
  
    try {
      const response = await AxiosPublico.post(UsuarioIniciarSesion, {
        usuario: usuario,
        contrasena: contrasena,
      });
  
      if (response?.data.data && response.data.data.token) {
        const { token, usuario, nombre, id, rol } = response.data.data;
  
        // Guardar sesión
        setLogin({
          usuario: {
            usuario: usuario,
            nombre: nombre,
            id: id,
            rol: rol,  
          },
          token: token,
        });
  
        // Guardar en sessionStorage
        setStoredUser({ usuario, token });
  
        // Redirigir según el rol del usuario
        if (rol === "admin") {
          navigate("/HomeAdmin");  // Página de admin
        } else {
          navigate("/home");  // Página de usuario
        }
  
        mostrarAlertaOK("Inicio de sesión exitoso", "success");
      } else {
        mostrarAlertaError("Error en el inicio de sesión. Inténtelo de nuevo.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      mostrarAlertaError("Usuario o contraseña incorrectos.");
    }
  };
  
  return (
    <div
      className="d-flex align-items-center justify-content-center bg-light"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
     <div
        className="p-4 rounded shadow"
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
        }}
      >
        <h2 className="text-center mb-4 text-dark fw-bold">Inicio de Sesión</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group position-relative">
            <input
              type="text"
              className="form-control rounded-pill px-4 py-2 border-0 shadow-sm"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
            />
            <span
              className="position-absolute text-muted"
              style={{
                top: "50%",
                right: "15px",
                transform: "translateY(-50%)",
              }}
            >
              <FontAwesomeIcon icon={faUser} />
            </span>
          </div>

          <div className="form-group position-relative mt-3">
            <input
              type="password"
              className="form-control rounded-pill px-4 py-2 border-0 shadow-sm"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <span
              className="position-absolute text-muted"
              style={{
                top: "50%",
                right: "15px",
                transform: "translateY(-50%)",
              }}
            >
              <FontAwesomeIcon icon={faLock} />
            </span>
          </div>
          {/*Iniciar sesion */}
          <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-bold mt-3 shadow-sm">
            Iniciar sesión
          </button>

          </form>
      </div>
    </div>
  );
};


export default Login;
