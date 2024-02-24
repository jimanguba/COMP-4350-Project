import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Login from '../src/components/Login'; // Adjust the import path if necessary
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  return (
    <Router>
    <Routes>
            <Route path='/Login' element={<Login/>} />
    </Routes>
  </Router>
  );
}

export default App;