import './App.css';
import NavBar from './Components/NavBar'
import Home from './Components/Home'
import About from './Components/About'
import Login from './Components/login'
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
        <NavBar />
       <Alert />
        <div className="container">
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </NoteState>
  );
}


export default App;
