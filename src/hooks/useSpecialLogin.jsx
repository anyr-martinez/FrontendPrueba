// src/hooks/useSpecialLogin.js
import { useNavigate } from "react-router-dom";

const useSpecialLogin = () => {
  const navigate = useNavigate();

  const checkSpecialLogin = (user, password) => {
    if (user === "Admin" && password === "Admin123") {
      navigate("/registro-usuario");
      return true;
    }
    return false;
  };

  return { checkSpecialLogin };
};

export default useSpecialLogin;