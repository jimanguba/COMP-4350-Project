import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Login from '../src/components/Login'; // Adjust the import path if necessary
import './App.css';
<<<<<<< HEAD
import { useEffect, useState } from 'react';

function App() {
  return (
    <Router>
    <Routes>
            <Route path='/Login' element={<Login/>} />
    </Routes>
  </Router>
=======
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
>>>>>>> 05e98abfc998fa186a1ed90e73ff89e08b0a7475
  );
}

export default App;