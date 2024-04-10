import '../components/BookTable'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { API_URL } from '../proxy'

function App () {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(`${API_URL}/books`)
        setData(response)
      } catch (error) {
        console.error(error.message)
      }
    }

    fetchData()
  }, [])

  return (
    <div
      className='container my-5'
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Pages</th>
            <th>Genre</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.bookid}>
              <td>{item.bookid}</td>
              <td>{item.title}</td>
              <td>{item.author}</td>
              <td>{item.pages}</td>
              <td>{item.genre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
