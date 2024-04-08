import React, { useState } from 'react'
import '../styles/LoginForm.css'
import axios from 'axios'
import TextField from '@mui/material/TextField'
import Cookies from 'universal-cookie'
import Sidebar from '../components/Sidebar'

const SettingsForm = () => {
  const [password, setPassword] = useState('')
  const cookies = new Cookies(null, { path: '/' })

  const resetGoals = (event) => {
    event.preventDefault()
    axios
      .get('/resetGoals', {
        params: {
          userId: cookies.get('userID')
        }
      })
      .catch(function (error) {
        console.log(error)
        alert('Something went wrong')
      })
  }

  const changePassword = (event) => {
    event.preventDefault()
    axios
      .get('/changePassword', {
        params: {
          userId: cookies.get('userID'),
          password
        }
      })
      .catch(function (error) {
        console.log(error)
        alert('Password is too short (must be length 5)')
      })
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div className='form-container'>
        <h1 className='h1'>Settings</h1>
        <form>
          <TextField
            class='TextField2'
            type='password'
            placeholder='New Password'
            onChange={(event) => {
              setPassword(event.target.value)
            }}
            required
          />
          <div class='flex'>
            <form class='flex-item'>
              <button class='button2' onClick={changePassword}>
                Change Password
              </button>
            </form>
            <form class='flex-item'>
              <button class='button2' onClick={resetGoals}>
                Reset Goals
              </button>
            </form>
          </div>
        </form>
      </div>
    </div>
  )
}
export default SettingsForm
