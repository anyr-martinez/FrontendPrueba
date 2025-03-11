import React, { useState } from "react";
import { useParams, useNavigate, Link} from "react-router-dom";
import fondo from "../../../assets/images/fondo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import {
  mostrarAlertaError,
  mostrarAlertaOK,
} from "../../SweetAlert/SweetAlert";
import { AxiosPublico } from "../../Axios/Axios";
import { UsuarioActualizarContrasena } from "../../Configuration/ApiUrls";

const ActualizarContrasena = () => {
  const { usuario } = useParams();
  const navigate = useNavigate();
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");

  const validarContrasena = () => {
    if (nuevaContrasena.length < 6) {
      mostrarAlertaError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    if (nuevaContrasena !== confirmarContrasena) {
      mostrarAlertaError("Las contraseñas no coinciden.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarContrasena()) return;

    try {
      const response = await AxiosPublico.put(UsuarioActualizarContrasena, {
        usuario,
        nuevaContrasena,
      });

      if (response.status === 200) {
        mostrarAlertaOK("Contraseña actualizada correctamente.");
        navigate("/");
      } else {
        mostrarAlertaError("Error al actualizar la contraseña.");
      }
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      mostrarAlertaError("Error en la conexión con el servidor.");
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
        <h2 className="text-center mb-4">Actualizar Contraseña</h2>
        <p className="text-center">Usuario: <strong>{usuario}</strong></p>

        <form onSubmit={handleSubmit}>
          <div className="form-group position-relative">
            <input
              type="password"
              className="form-control"
              placeholder="Nueva Contraseña"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
              required
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

          <div className="form-group position-relative mt-3">
            <input
              type="password"
              className="form-control"
              placeholder="Confirmar Contraseña"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              required
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

          <button type="submit" className="btn btn-primary btn-block mt-3">
            Actualizar
          </button>

          <div className="text-center my-3">
            <Link to="/" className="text-primary">
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActualizarContrasena;
