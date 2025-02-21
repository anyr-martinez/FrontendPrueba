import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosPublico } from "../../Axios/Axios";
import { CrearUsuario, UsuarioExistente } from "../../Configuration/ApiUrls"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import fondo from "../../../assets/images/fondo.jpg";
import {
  mostrarAlerta,
  mostrarAlertaOK,
  mostrarAlertaError,
} from "../../SweetAlert/SweetAlert";
import zxcvbn from "zxcvbn";

const RegistroUsuario = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    usuario: "",
    contrasena: "",
    confirmarContrasena: "",
  });
  const [message] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["nombre", "usuario"].includes(name)) {
      const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!regex.test(value)) {
        mostrarAlerta("Solo se permiten letras y espacios en este campo.", "warning");
        return;
      }
    }
    setFormData({ ...formData, [name]: value });
    if (name === "contrasena") evaluatePasswordStrength(value);
  };

  const evaluatePasswordStrength = (contrasena) => {
    const strength = zxcvbn(contrasena).score;
    setPasswordStrength(strength);
  };

  const verificarUsuarioExistente = async (usuario) => {
    try {
      const response = await AxiosPublico.post(UsuarioExistente, { usuario });
      if (response.data && response.data.existe) {
        mostrarAlerta("El usuario ya existe. Por favor, elija otro.", "warning");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al verificar el usuario:", error);
      setError("Error al verificar el usuario. Por favor, inténtelo de nuevo.");
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const usuarioExiste = await verificarUsuarioExistente(formData.usuario);
    if (usuarioExiste) return;

    if (!formData.nombre || !formData.usuario || !formData.contrasena || !formData.confirmarContrasena) {
      mostrarAlerta("Por favor, complete todos los campos obligatorios.", "warning");
      return;
    }

    if (formData.contrasena.length < 6) {
      mostrarAlerta("La contraseña debe tener al menos 6 caracteres.", "warning");
      return;
    }

    if (formData.contrasena !== formData.confirmarContrasena) {
      mostrarAlertaError("Las contraseñas no coinciden. Por favor, inténtelo de nuevo.", "warning");
      return;
    }

    const formDataConId = {
      nombre: formData.nombre,
      usuario: formData.usuario,
      contrasena: formData.contrasena,
    };

    setLoading(true);
    try {
      const response = await AxiosPublico.post(CrearUsuario, formDataConId);
      if (response.data || response.data.id) {
        mostrarAlertaOK("Usuario creado correctamente", "success");
        navigate("/", { state: { userId: response.data.id } });
      } else {
        console.log(response.data);
        mostrarAlertaError("Error al guardar el usuario. Por favor, inténtelo de nuevo.");
      }
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      setError("Error al guardar el usuario. Por favor, inténtelo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div
      className="registro-usuario-container d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div
        className="registro-usuario-box p-4 rounded shadow"
        style={{
          maxWidth: "900px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.75)",
        }}
      >
        <h2 className="text-center mb-4">Registro de Usuario</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        {message && <p className="text-success text-center">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
                <span
                  className="position-absolute"
                  style={{
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                  }}
                >
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </div>
              <div className="form-group position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Usuario"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                />
                <span
                  className="position-absolute"
                  style={{
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                  }}
                >
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Contraseña"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                />
                <span
                  className="position-absolute"
                  style={{
                    top: "50%",
                    right: "40px",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                  onClick={toggleShowPassword}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
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
              <div className="form-group position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Confirmar Contraseña"
                  name="confirmarContrasena"
                  value={formData.confirmarContrasena}
                  onChange={handleChange}
                />
                <span
                  className="position-absolute"
                  style={{
                    top: "50%",
                    right: "40px",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                  onClick={toggleShowPassword}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
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
              {formData.contrasena && (
                <div className="form-group">
                  <div className="progress">
                    <div
                      className={`progress-bar ${
                        passwordStrength < 2
                          ? "bg-danger"
                          : passwordStrength < 4
                          ? "bg-warning"
                          : "bg-success"
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
            </div>
          </div>

          <div className="d-flex flex-column align-items-center">
            <button
              type="submit"
              className="btn btn-primary mb-2"
              style={{ width: "800px" }}
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrar"}
            </button>
            <span className="text-muted mb-3">¿Ya tienes una cuenta? <a href="/" className="text-primary">Inicia sesión</a>.</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroUsuario;
