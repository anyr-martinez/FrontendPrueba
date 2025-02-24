import { useState } from "react";
import { DesEncriptar, Encriptar } from "../../Encrypt/Crypto";

export const useSessionStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = DesEncriptar(window.sessionStorage.getItem(keyName));
      if (value) {
        return JSON.parse(value);
      } else {
        // Encriptamos y guardamos el valor inicial si no hay nada
        const encryptedValue = Encriptar(JSON.stringify(defaultValue));
        window.sessionStorage.setItem(keyName, encryptedValue);
        return defaultValue;
      }
    } catch (err) {
      console.error("Error al leer desde sessionStorage:", err);
      return defaultValue;
    }
  });

  const setValue = (newValue) => {
    try {
      const encryptedValue = Encriptar(JSON.stringify(newValue));
      window.sessionStorage.setItem(keyName, encryptedValue);
      setStoredValue(newValue);
    } catch (err) {
      console.error("Error al escribir en sessionStorage:", err);
    }
  };
  

  return [storedValue, setValue];
};
