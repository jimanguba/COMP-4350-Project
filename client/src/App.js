
import './App.css';
import Home from './pages/Home'
import Statistics from './pages/Statistics'
// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
    return (
        <Router>
            <div className="app-container">
                {/* Sidebar */}
                <div className="sidebar">
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/statistics">Statistics</a></li>
                        {/* Add more sidebar links as needed */}
                    </ul>
                </div>
                {/* Main Content */}
                <div className="main-content">
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        
                        <Route path="/statistics" element={<Statistics user_id={1}/>} /> {/* TODO: user_id is hardcoded - change user_id to something more dynamic*/}
                        {/* Add more routes for additional pages */}
                    </Routes>
                </div>
            </div>
        </Router>
    )
};

export default App;

