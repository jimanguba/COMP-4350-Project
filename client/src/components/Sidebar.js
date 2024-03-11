import React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import ListIcon from '@mui/icons-material/ListAlt';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined'; // Statistics
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import '../styles/StyleForm.css'; 

const sidebar = () => {
    return (
    <Sidebar className = "app">
    <Menu>
        <MenuItem
            icon={<MenuOutlinedIcon
                onClick={() => {
                    collapseSidebar();
                }}
            />}
        >
            <Link to="/">
                <h2>BOOKSHELF</h2>
            </Link>
        </MenuItem>
        {/* <MenuItem
            component={<Link to="/" />}
            icon={<HomeOutlinedIcon />}
        >
            Home
        </MenuItem> */}
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
        <MenuItem
            component={<Link to="/goals" />}
            icon={<BallotOutlinedIcon />}
        >
            Goals
        </MenuItem>
        <MenuItem
            component={<Link to="/login" />}
            icon={<LogoutIcon />}
        >
            Log Out
        </MenuItem>
    </Menu>
</Sidebar>
    )
}

export default sidebar