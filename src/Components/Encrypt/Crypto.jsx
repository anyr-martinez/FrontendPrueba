import CryptoJS from 'crypto-js';
const clave = 'MyClaveSecreta'; 

export const Encriptar = (datos) => {
    // Cifra los datos y los convierte en un string
    const encrypt = CryptoJS.AES.encrypt(
        JSON.stringify(datos),
        clave,
    ).toString();
    return encrypt;
};

export const DesEncriptar = (datos) => {
    // Desencripta los datos
    const decrypt = CryptoJS.AES.decrypt(datos, clave).toString(CryptoJS.enc.Utf8);
    
    // Si los datos desencriptados son una cadena JSON válida, retornamos el objeto
    try {
        return JSON.parse(decrypt);  // Intentamos hacer JSON.parse directamente
    } catch (error) {
        console.error("Error al parsear los datos desencriptados:", error);
        return null;  // Si no es válido, devolvemos null o un valor por defecto
    }
};
