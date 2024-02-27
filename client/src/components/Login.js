import React, { useState } from 'react';
import '../styles/LoginForm.css'; 
import axios from "axios";
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginflag] = useState(false);
   
  const navigate = useNavigate();

  const loginClick = (event) => {
    event.preventDefault();
    axios.get('http://localhost:5000/login', {
      params: {
        username: username,
        password:password
      }
    }).then(function(response){
      if(response.status == 200)
      {
        navigate('/Home');
      }
    })
    .catch(function(error)
    {
      console.log(error)
      alert("Username does not exist or Password is Wrong");
    })
  }

  const SignUpClick = (event) => {
    event.preventDefault();
    axios.get('http://localhost:5000/signup', {
      params: {
        username: username,
        password:password
      }
    }).then(function(response){
      if(response.status == 200)
      {
        navigate('/Home');
      }
    })
    .catch(function(error)
    {
      console.log(error)
      alert("Username already exists or Password is too short (must be length 5)");
    })
  }

  if(!loginflag)
  {
    return (
      <div class="form-container"> 
        <h1 className="h1"> Bookshelf</h1>
          <form>
            <TextField
              class="TextField1"
              type = "text"
              placeholder="Username"
              onChange={ (event) =>  { setUsername(event.target.value) } }
              required
            />
            <TextField
              class="TextField2"
              type = "password"
              placeholder="Password"
              onChange={ (event) =>  { setPassword(event.target.value); } }
              required
            />
            <div class="flex">
              <form class="flex-item">
                <button class="button" onClick={loginClick}>Log In</button>
              </form>
              <form class="flex-item">
                <button class="button2" onClick={SignUpClick}>Sign Up</button>
              </form>
            </div>
          </form>
        </div>
      );
    }
  }
export default LoginForm;