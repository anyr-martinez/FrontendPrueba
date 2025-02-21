import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import fondo from "../../assets/images/fondo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { UsuarioIniciarSesion } from "../Configuration/ApiUrls";
import { AxiosPublico } from "../Axios/Axios";
import {
  mostraAlerta,
  mostraAlertaOK,
  mostraAlertaError,
} from "../SweetAlert/SweetAlert";
import { UserContext } from "../Context/user/UserContext";
import { useSessionStorage } from "../Context/storage/useSessionStorage";
import useSpecialLogin from "../../hooks/useSpecialLogin"; // Importar el hook personalizado

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { setLogin } = useContext(UserContext);
  const [storedUser, setStoredUser] = useSessionStorage("user", "");
  const { checkSpecialLogin } = useSpecialLogin(); // Usar el hook personalizado

  useEffect(() => {
    setLogin({ user: null, token: null });
  }, [setLogin]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user || !password) {
      mostraAlerta("Por favor, complete todos los campos.", "warning");
      return;
    }

    // Verificar credenciales específicas para registro de docente
    if (checkSpecialLogin(user, password)) {
      return;
    }

    try {
      const response = await AxiosPublico.post(UsuarioIniciarSesion, {
        login: user,
        contrasena: password,
      });

      if (response && response.data) {
        const { Token, Usuario } = response.data;

        setLogin({
          usuario: {
            nombre: Usuario.nombre,
            usuario: Usuario.usuario,
            login: Usuario.login,
            id: Usuario.id,
          },
          token: Token,
        });

        setStoredUser(user); // Guardar el email en sessionStorage

        if (Usuario.tipo === "Usuario") {
          navigate("/dashboard-equipments");
        } else {
          navigate("/");
        }

        mostraAlertaOK("Inicio de sesión exitoso", "success");
      } else {
        mostraAlertaError(
          "Error en el inicio de sesión. Por favor, inténtelo de nuevo.",
          "error"
        );
      }
    } catch (error) {
      mostraAlertaError(
        "Contraseña o Correo electrónico incorrecto.",
        "error"
      );
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center bg-light"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div
        className="p-4 rounded shadow"
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.75)",
        }}
      >
        <h2 className="text-center mb-4">Inicio de Sesión</h2>

        {error && <p className="text-danger text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group position-relative">
            <input
              type="text"
              className="form-control"
              placeholder="Email"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoComplete="username"
            />
            <span
              className="position-absolute"
              style={{
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
              }}
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
          </div>

          <div className="form-group position-relative">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <span
              className="position-absolute"
              style={{
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
              }}
            >
              <FontAwesomeIcon icon={faLock} />
            </span>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Sign In
          </button>

          <div className="text-center my-3 position-relative">
            <span className="text-muted">- OR -</span>
            <hr
              className="position-absolute"
              style={{
                top: "50%",
                left: "0",
                width: "40%",
                transform: "translateY(-50%)",
              }}
            />
            <hr
              className="position-absolute"
              style={{
                top: "50%",
                right: "0",
                width: "40%",
                transform: "translateY(-50%)",
              }}
            />
          </div>

          <Link
            to="/recuperar-contrasena"
            className="btn btn btn-info btn-block mb-2"
          >
            Olvidé la Contraseña
          </Link>

          <Link to="/registro-estudiante" className="btn btn-info btn-block">
            Crear Cuenta
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;