import './App.css';
import {  Route,  Routes} from 'react-router-dom';
import Inicio from './fragment/Inicio';
import Api from './fragment/Api';
import Login from './fragment/Login';
import Registro from './fragment/Registro';
import RadiacionUv from './fragment/RadiacionUv'
import PeticionApi from './fragment/PeticionApi';
import ClasificacionComentario from './fragment/ClasificacionComentario';
import Conocenos from './fragment/Conocenos';
import PerfilUsuario from './fragment/PerfilUsuario';

function App() {
  return (
    <Routes> 
        <Route path='/' element={<Inicio/>} />
        <Route path='/api' element={<Api/>} />
        <Route path='/iniciar-sesion' element={<Login/>} />
        <Route path='/registro' element={<Registro/>} />
        <Route path='/radiacion' element={<RadiacionUv/>} />
        <Route path='/peticion-api' element={<PeticionApi/>} />
        <Route path='/comentarios' element={<ClasificacionComentario/>} />
        <Route path='/conocenos' element={<Conocenos/>} />
        <Route path='/perfil-usuario' element={<PerfilUsuario/>} />
    </Routes>
  );
}

export default App;