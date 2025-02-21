
import { createContext, useContext} from "react";
export const UserContext = createContext();

export const useContextUsuario=()=>{
    return useContext(UserContext);
}

