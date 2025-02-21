import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosPublico } from "../../Axios/Axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { mostraAlerta, mostraAlertaOK } from "../../SweetAlert/SweetAlert";
import { CrearUsuario } from "../../Configuration/ApiUrls";

const RegistroUsuario = () => {
  const [formData, setFormData] = useState({
    name: "",
    usuario: "",
    password: "",
    confirmarPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.usuario || !formData.password) {
      mostraAlerta("Todos los campos son necesarios", "warning");
      return;
    }

    if (formData.password.length < 6) {
      mostraAlerta("La contraseña debe tener al menos 6 caracteres", "warning");
      return;
    }

    if (formData.password !== formData.confirmarPassword) {
      mostraAlerta("Las contraseñas no coinciden", "warning");
      return;
    }

    try {
      setLoading(true);
      const response = await AxiosPublico.post(CrearUsuario, {
        name: formData.name,
        usuario: formData.usuario,
        password: formData.password,
      });
      mostraAlertaOK("Usuario registrado correctamente", "success");
      navigate("/login");
    } catch (error) {
      mostraAlerta("Error al registrar el usuario", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg">
        <h2 className="text-center">Registro de Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input type="text" className="form-control" name="usuario" value={formData.usuario} onChange={handleChange} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input type={showPassword ? "text" : "password"} className="form-control" name="password" value={formData.password} onChange={handleChange} />
              <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Confirmar Contraseña</label>
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input type={showPassword ? "text" : "password"} className="form-control" name="confirmarPassword" value={formData.confirmarPassword} onChange={handleChange} />
              <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistroUsuario;