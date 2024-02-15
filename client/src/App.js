
import './App.css';
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateAccount from './Components/CreateAccount'

function App(){
  const [token, setToken] = useState('');

  useEffect(() => {
    const lsToken = localStorage.getItem("token");
    if (lsToken) {
        setToken(lsToken);
    }
  }, []);

  if (token) {
    return (
        <Router>
        <Routes>
            <Route exact path="/" element={<CreateAccount/>} />
            <Route path='/CreateAccount' element={<CreateAccount/>} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
    <Routes>
            <Route exact path="/" element={<CreateAccount />} />
            <Route path='/CreateAccount' element={<CreateAccount/>} />
      </Routes>
    </Router>
  );
}

export default App;