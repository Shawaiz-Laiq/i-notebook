import './App.css';
import NavBar from './Components/NavBar'
import Notes from './Components/Notes'
import Home from './Components/Home'
import About from './Components/About'
import Login from './Components/login'
import Signup from './Components/singup';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"
import NoteState from './Context/NoteState';
import Alert from './Components/Alert';
import { useRef , useState } from 'react';

function App() {
  

  return (
    <NoteState>
      <Router>
        {/* <NavBar />
       <Alert /> */}
       
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/home" element={ <><NavBar /> <Alert /> <Home /></>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Login />} />
          </Routes>
       
      </Router>
    </NoteState>
  );
}


export default App;
