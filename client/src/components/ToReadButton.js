/**
 * Button for adding/removing a book from the user's "to read"
 * @param {Object} book
 */

import React, { useState, useEffect } from 'react'
import '../styles/ReadingStateButton.css'
import Cookies from 'universal-cookie'
import axios from 'axios'
import { API_URL } from '../proxy'

export default function ToReadButton ({ bookid }) {
  const cookies = new Cookies(null, { path: '/' })
  const userID = cookies.get('userID')
  const [onToRead, setOnToRead] = useState(false)

  useEffect(() => {
    axios
      .get(`${API_URL}/users/${userID}/toRead/${bookid}`)
      .then((response) => setOnToRead(response.data.toRead))
      .catch((error) => console.error('Error fetching to-read:', error))
  }, [])

  const toggleReadingState = () => {
    axios
      .put(`${API_URL}/users/${userID}/toRead/${bookid}`, { toRead: !onToRead })
      .then(() => setOnToRead(!onToRead))
      .catch((error) => console.error('Error updating to-read status:', error))
  }

  return (
    <button
      className={`readingStateButton ${onToRead ? 'onToRead' : 'offToRead'}`}
      onClick={toggleReadingState}
    >
      {onToRead ? 'On To-Read' : 'Add to To-Read'}
    </button>
  )
}
