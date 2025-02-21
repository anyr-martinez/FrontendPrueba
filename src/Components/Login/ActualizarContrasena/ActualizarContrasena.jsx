import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import fondo from "../../../assets/images/fondo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { AxiosPublico } from "../../Axios/Axios";
import { mostraAlertaOK, mostraAlertaError } from "../../SweetAlert/SweetAlert";
import zxcvbn from "zxcvbn";

const ActualizarContrasena = () => {
  const { id } = useParams(); // Obtener el id del usuario desde los parámetros de la URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    const strength = zxcvbn(password).score;
    setPasswordStrength(strength);
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      mostraAlertaError("Las contraseñas no coinciden. Por favor, inténtelo de nuevo.", "error");
      return;
    }

    if (!newPassword || !confirmPassword) {
      mostraAlertaError("Por favor complete todos los campos.", "error");
      return;
    }

    try {
      const response = await AxiosPublico.put(`/update-password/${id}`, {
        newPass: newPassword,
      });

      mostraAlertaOK("Contraseña actualizada correctamente.", "success");
      console.log("Password updated:", response.data);
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Error al actualizar la contraseña.");
        mostraAlertaError("Error al actualizar la contraseña. Por favor, inténtelo de nuevo.", "error");
        console.error("Password update failed:", error.response.data);
      } else if (error.request) {
        setError("No se recibió respuesta del servidor.");
        mostraAlertaError("No se recibió respuesta del servidor. Por favor, inténtelo de nuevo.", "error");
        console.error("No response received:", error.request);
      } else {
        setError("Error al enviar la solicitud.");
        mostraAlertaError("Error al enviar la solicitud. Por favor, inténtelo de nuevo.", "error");
        console.error("Error in request setup:", error.message);
      }
    }
  };

  return (
    <div
      className="recuperar-contrasena-container d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div
        className="recuperar-contrasena-box p-4 rounded shadow"
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.75)",
        }}
      >
        <h2 className="text-center mb-4">Actualizar Contraseña</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleUpdatePassword}>
          <div className="form-group position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Nueva Contraseña"
              value={newPassword}
              onChange={handlePasswordChange}
              autoComplete="new-password"
            />
            <span
              className="position-absolute"
              style={{
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          {newPassword && (
            <div className="form-group">
              <div className="progress">
                <div
                  className={`progress-bar ${
                    passwordStrength < 2 ? "bg-danger" : passwordStrength < 4 ? "bg-warning" : "bg-success"
                  }`}
                  role="progressbar"
                  style={{ width: `${(passwordStrength + 1) * 20}%` }}
                  aria-valuenow={(passwordStrength + 1) * 20}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <small className="form-text text-muted">
                {passwordStrength < 2
                  ? "Contraseña débil"
                  : passwordStrength < 4
                  ? "Contraseña aceptable"
                  : "Contraseña fuerte"}
              </small>
            </div>
          )}

          <div className="form-group position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
            <span
              className="position-absolute"
              style={{
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary mb-2" style={{ width: "300px" }}>
              Actualizar Contraseña
            </button>
          </div>
        </form>

        <div className="text-center mt-2">
          <button
            className="btn btn-secondary mt-2"
            style={{ width: "300px" }}
            onClick={() => navigate("/login")}
          >
            Regresar al Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActualizarContrasena;
