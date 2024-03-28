import React, { useState } from 'react';
import axios from "axios";
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const SettingsForm = () => {

    const darkModeClick = (event) => {
        //do this last
    }

    const changePasswordClick = (event) => {

    }

    const removeGoalsClick = (event) => {

    }

    return (
        <div style={{display: "flex", height: "100vh"}}>
            <Sidebar />
        </div>
    )
};

export default SettingsForm;
