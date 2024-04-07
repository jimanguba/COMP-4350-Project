import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React from 'react';
import Login from '../src/components/Login'; // Adjust the import path if necessary
import ReviewsList from './components/ReviewList'; // Adjust the import path if necessary
import ReviewsForm from './components/ReviewForm';
import Home from './pages/Home'
import Statistics from './pages/Statistics'
import BookList from './pages/BookList';
import Goals from '../src/components/Goals';
import './App.css';
import ViewBook from './components/ViewBook';
import Settings from './pages/Settings'
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import ListIcon from '@mui/icons-material/ListAlt';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined'; // Statistics
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import { useEffect, useState } from 'react';
import ReviewForm from './components/ReviewForm';

// eslint-disable-next-line

function App() {

        return (
            <Router>
            <div>
                    <Routes>
                        <Route exact path="/" element={<Login />} />
                        <Route path="/statistics" element={<Statistics user_id={1}/>} /> {/* TODO: in sprint 3 - user_id is hardcoded - change user_id to something more dynamic*/}
                        <Route path="/view-book/:book_id" element={<ViewBook />} />
                        <Route path="/reviews/new" element={<ReviewsForm />} />
                        <Route path="/book-list" element={<BookList type={"all"} />} />
                        <Route path="/completed-books" element={<BookList type={"completed"} />} />
                        <Route path="/to-read" element={<BookList type={"to-read"} />} />
                        <Route path="/review" element={<ReviewsList />} />
                        <Route path="/login" element={<Login/>} />
                        <Route path="/home" element={<Home/>} />
                        <Route path="/goals" element={<Goals />} /> 
                        <Route path="/settings" element={<Settings />} /> 
                    </Routes>
            </div>
            </Router>
        )

    
};

export default App;
