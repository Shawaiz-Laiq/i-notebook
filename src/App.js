import './App.css';
import NavBar from './Components/NavBar'
import Home from './Components/Home'
import About from './Components/About'
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
        <NavBar />
        <Alert msg="This is the Msg" />
        <div className="container">
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </NoteState>
  );
}


export default App;
