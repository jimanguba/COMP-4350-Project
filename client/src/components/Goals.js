import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import Cookies from 'universal-cookie'

import '../styles/Goals.css'

const GoalForm = () => {
  const cookies = new Cookies(null, { path: '/' })
  const setLoading = useState(true)
  const [data, setData] = useState([])
  const [goalText, setGoalText] = useState('')
  const [goalStauts, setGoalStatus] = useState('')
  const [goalNumber, setGoalNumber] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data: response } = await axios.get('/getGoals', {
          params: { userId: cookies.get('userID') }
        })
        setData(response)
      } catch (error) {
        console.error(error.message)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  const addGoal = (event) => {
    event.preventDefault()
    axios
      .get('/goalCreate', {
        params: {
          goalText,
          goalStauts,
          goalNumber,
          userId: cookies.get('userID')
        }
      })
      .catch(function (error) {
        console.log(error)
        alert('Something went wrong')
      })
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div class='form-container'>
        <h1 className='h1'> User Goals</h1>
        <h2 className='h2'>
          Enter in your reading goals below, you can then mark your goals as
          completed or if you want change them as you go!
        </h2>
        <table>
          <label className='label' for='goalInput'>
            Goal:
          </label>
          <textarea
            className='textarea'
            id='goalInput'
            placeholder='Enter your goal'
            onChange={(event) => {
              setGoalText(event.target.value)
            }}
          />

          <label className='label' for='status'>
            Choose a goal status{' '}
          </label>

          <select
            name='status'
            id='status'
            onChange={(event) => {
              setGoalStatus(event.target.value)
            }}
          >
            <option value='' disabled selected>
              Select your option
            </option>
            <option value='in-progress'>In-Progress</option>
            <option value='complete'>Complete</option>
            <option value='abandoned'>Abandoned</option>
          </select>

          <label className='label' for='goalNumber'>
            {' '}
            Goal Number:{' '}
          </label>
          <input
            className='input'
            type='text'
            id='goalNumber'
            placeholder='Goal to change'
            required
            onChange={(event) => {
              setGoalNumber(event.target.value)
            }}
          ></input>

          <button className='button' onClick={addGoal}>
            {' '}
            Add/Edit Goal{' '}
          </button>
        </table>
        <table className='table'>
          <thead>
            <tr>
              <th>Goal Number</th>
              <th>Goal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.goal_id}>
                <td>{item.goal_id_to_user}</td>
                <td>{item.goal_text}</td>
                <td>{item.goal_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GoalForm
