import React from 'react';
import { routes } from './Components/Routes/routes'
import {RouterProvider} from 'react-router-dom';
import  UserState from './Components/Context/user/UserState';
import Modal from 'react-modal';

// Definir el elemento 'app' de la aplicacion 
Modal.setAppElement('#root');  
function App(){
  return(
    <UserState>
      <RouterProvider router={routes}>
      </RouterProvider>
    </UserState>
  )
}

export default App;