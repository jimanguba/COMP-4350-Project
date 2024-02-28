import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Login from '../src/components/Login'; // Adjust the import path if necessary
import ReviewsList from './components/ReviewList'; // Adjust the import path if necessary
import Home from './pages/Home'
import Statistics from './pages/Statistics'
import BookList from './pages/BookList';
import './App.css';
import ViewBook from './components/ViewBook';

// eslint-disable-next-line


function App() {
    return (
        <Router>
            <div className="app-container">
                {/* Sidebar */}
                <div className="sidebar">
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/statistics">Statistics</a></li>
                        <li><a href="/book-list">Book List</a></li>
                        <li><a href="/review">Review</a></li>
                        {/* Add more sidebar links as needed */}
                    </ul>
                </div>
                {/* Main Content */}
                <div className="main-content">
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route path="/statistics" element={<Statistics user_id={1}/>} /> {/* TODO: in sprint 3 - user_id is hardcoded - change user_id to something more dynamic*/}
                        <Route path="/book-list" element={<BookList />} />
                        <Route path="/review" element={<ReviewsList />} />
                        <Route path='/Login' element={<Login/>} />
                        {/* Add more routes for additional pages */}
                    </Routes>
                </div>
            </div>
        </Router>
    )
};

export default App;
