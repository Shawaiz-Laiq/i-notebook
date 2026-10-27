import './App.css';
import NavBar from './Components/NavBar'
import Home from './Components/Home'
import About from './Components/About'
import Login from './Components/login'
import Account from "./Components/Account";
import Signup from './Components/singup';
import AdminLogin from './Components/AdminLogin';
import AdminDashboard from './Components/AdminDashboard';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"
import NoteState from './Context/NoteState';
import Alert from './Components/Alert';


function App() {
  

  return (
    <NoteState>
      <Router> 
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />          
            <Route path="/home" element={ <><NavBar /> <Alert /> <Home /></>} />
            <Route path="/account" element={<><NavBar /> <Account /> </>} />
            <Route path="/about" element={<><NavBar /> <About/> </>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Login />} />
          </Routes>
       
      </Router>
    </NoteState>
  );
}


export default App;
