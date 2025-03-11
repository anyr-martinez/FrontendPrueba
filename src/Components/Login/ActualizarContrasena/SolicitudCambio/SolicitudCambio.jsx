// import React, { useState, useContext } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import fondo from "../../../../assets/images/fondo.jpg";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser } from "@fortawesome/free-solid-svg-icons";
// import { 
//   mostrarAlertaError,
//   mostrarAlertaWarning, 
//   mostrarAlertaOK 
// } from "../../../SweetAlert/SweetAlert";
// import { UserContext } from "../../../Context/user/UserContext";
// import { UsuarioName } from "../../../Configuration/ApiUrls";
// import { AxiosPublico } from "../../../Axios/Axios";

// const SolicitarCambio = () => {
//   const [usuario, setUsuario] = useState("");
//   const { setLogin } = useContext(UserContext); // Usar setLogin del contexto
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     if (!usuario) {
//       mostrarAlertaWarning("Por favor, ingrese su usuario.");
//       return;
//     }
  
//     try {
//       const response = await AxiosPublico.get(UsuarioName, { params: { usuario } });
//       console.log("Usuarios recibidos:", response.data.users);
  
//       // Buscar el usuario en el arreglo de users
//       const user = response.data.users.find(u => u.usuario === usuario);
  
//       if (user) {
//         setLogin({ usuario: user, token: response.data.token });
//         mostrarAlertaOK("Usuario encontrado exitosamente!");
//         navigate(`/actualizar-contrasena/${user.usuario}`);
//       } else {
//         mostrarAlertaError("Usuario no encontrado.");
//       }
//     } catch (error) {
//       console.error("Error al buscar el usuario:", error);
//       mostrarAlertaError("Error en la conexión con el servidor.");
//     }
//   };
//     return (
//     <div
//       className="d-flex align-items-center justify-content-center bg-light"
//       style={{
//         backgroundImage: `url(${fondo})`,
//         backgroundSize: "contain",
//         backgroundPosition: "center",
//         height: "100vh",
//         width: "100vw",
//       }}
//     >
//       <div
//         className="p-4 rounded shadow"
//         style={{
//           maxWidth: "400px",
//           width: "100%",
//           backgroundColor: "rgba(255, 255, 255, 0.85)",
//         }}
//       >
//         <h2 className="text-center mb-4">Usuario</h2>

//         <form onSubmit={handleSubmit}>
//           <div className="form-group position-relative">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="usuario"
//               value={usuario}
//               onChange={(e) => setUsuario(e.target.value)}
//               autoComplete="username"
//             />
//             <span
//               className="position-absolute"
//               style={{
//                 top: "50%",
//                 right: "10px",
//                 transform: "translateY(-50%)",
//               }}
//             >
//               <FontAwesomeIcon icon={faUser} />
//             </span>
//           </div>

//           <button type="submit" className="btn btn-primary btn-block mt-3">
//             Continuar
//           </button>

//           <div className="text-center my-3">
//             <Link to="/" className="text-primary">
//               Volver al inicio de sesión
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SolicitarCambio;
