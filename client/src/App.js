import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React from 'react';
import Login from '../src/components/Login'; // Adjust the import path if necessary
import ReviewsList from './components/ReviewList'; // Adjust the import path if necessary
import Home from './pages/Home'
import Statistics from './pages/Statistics'
import BookList from './pages/BookList';
import './App.css';
import ViewBook from './components/ViewBook';
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import ListIcon from '@mui/icons-material/ListAlt';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined'; // Statistics
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';

// eslint-disable-next-line

function App() {
    const { collapseSidebar } = useProSidebar()
    return (
        <Router>
        <div style={{display: "flex", height: "100vh"}}>
            <Sidebar className = "app">
                <Menu>
                    <MenuItem
                        component={<Link to="/" className="link" />}
                        icon={
                            <MenuOutlinedIcon
                                onClick={() => {
                                    collapseSidebar();
                                    }}
                                    />
                                }
                    >
                        <h2>BOOKSHELF</h2>
                    </MenuItem>
                    <MenuItem
                        component={<Link to="/statistics"/>}
                        icon={<AssessmentOutlinedIcon />}
                    >
                        Statistics
                    </MenuItem>
                    <MenuItem
                        component={<Link to="/book-list" />}
                        icon={<ListIcon />}
                    >
                        Book List
                    </MenuItem>
                    <MenuItem
                        component={<Link to="/review" />}
                        icon={<RateReviewOutlinedIcon />}
                    >
                        Review
                    </MenuItem>
                </Menu>
            </Sidebar>
            <section>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/statistics" element={<Statistics user_id={1}/>} /> {/* TODO: in sprint 3 - user_id is hardcoded - change user_id to something more dynamic*/}
                    <Route path="/view-book" element={<ViewBook book={{title: "1984", genre: "sci-fi", author: "George Orwell", pages: 172}}/>} />   {/* TODO: similar to the above statistics, this needs to be made dynamic */}
                    <Route path="/book-list" element={<BookList />} />
                    <Route path="/review" element={<ReviewsList />} />
                    <Route path='/login' element={<Login/>} />
                </Routes>
            </section>
        </div>
        </Router>
        // <Router>
        //     <div className="app-container">
        //         {/* Sidebar */}
        //         <div className="sidebar">
        //             <ul>
        //                 <li><a href="/">Home</a></li>
        //                 <li><a href="/statistics">Statistics</a></li>
        //                 <li><a href="/book-list">Book List</a></li>
        //                 <li><a href="/review">Review</a></li>
        //                 {/* Add more sidebar links as needed */}
        //             </ul>
        //         </div>
        //         {/* Main Content */}
        //         <div className="main-content">
        //             <Routes>
        //                 <Route exact path="/" element={<Home />} />
        //                 <Route path="/statistics" element={<Statistics user_id={1}/>} /> {/* TODO: in sprint 3 - user_id is hardcoded - change user_id to something more dynamic*/}
        //                 <Route path="/view-book" element={<ViewBook book={{title: "1984", genre: "sci-fi", author: "George Orwell", pages: 172}}/>} />   {/* TODO: similar to the above statistics, this needs to be made dynamic */}
        //                 <Route path="/book-list" element={<BookList />} />
        //                 <Route path="/review" element={<ReviewsList />} />
        //                 <Route path='/Login' element={<Login/>} />
        //                 {/* Add more routes for additional pages */}
        //             </Routes>
        //         </div>
        //     </div>
        // </Router>
    )
};

export default App;
