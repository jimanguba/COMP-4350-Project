import React from 'react';
import ReviewsList from './components/ReviewList'; // Adjust the import path if necessary
import './App.css';
import Home from './pages/Home'
import Statistics from './pages/Statistics'
import ViewBook from './pages/ViewBook'
import BookList from './pages/BookList';

// eslint-disable-next-line

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
                        <li><a href="/review">Review</a></li>
                        {/* Add more sidebar links as needed */}
                    </ul>
                </div>
                {/* Main Content */}
                <div className="main-content">
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route path="/statistics" element={<Statistics />} />
                        <Route path="/view-book" component={ViewBook} />
                        <Route path="/book-list" component={BookList} />
                        <Route path="/review" element={<ReviewsList />} />
                        
                        {/* Add more routes for additional pages */}
                    </Routes>
                </div>
            </div>
        </Router>
    )
};

export default App;

