import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Login from '../src/Components/Login'; // Adjust the import path if necessary
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';


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
            <Route path='/Login' element={<Login/>} />
        </Routes>
      </Router>
    );
  }
}

export default App;