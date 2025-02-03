import logo from './logo.svg';
import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';

import {Route,Routes} from "react-router-dom"
import Tareas from './Components/Paginas/tareas';
import Categorias from './Components/Paginas/categorias';
function App() {
  
  return (
    <div>
        <Routes>
          <Route path ="/tareas" element= {<Tareas/>}/>
          <Route path ="/categorias" element= {<Categorias/>}/>
          <Route path ="/" element= {<LoginSignup/>}/>
        </Routes>
    </div>
  );
}
// <LoginSignup/> <Route path="/" element = {<Home/>}>
export default App;
