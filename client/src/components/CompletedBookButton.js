/**
 * Button for adding/removing a book from the user's "completed" list
 * @param {Object} book
 */

import React, { useState, useEffect } from 'react'
import '../styles/ReadingStateButton.css'
import Cookies from 'universal-cookie'
import axios from 'axios'
import { API_URL } from '../proxy'

export default function CompletedBookButton ({ bookid }) {
  const cookies = new Cookies(null, { path: '/' })
  const userID = cookies.get('userID')
  const [onCompletedBooks, setOnCompletedBooks] = useState(false)
  console.log(bookid);
  useEffect(() => {
    axios
      .get(`${API_URL}/users/${userID}/completedBooks/${bookid}`)
      .then((response) => {
        setOnCompletedBooks(response.data.completed)
      })
      .catch((error) => console.error('Error fetching completed books:', error))
  }, [])

  const toggleReadingState = () => {
    axios
      .put(`${API_URL}/users/${userID}/completedBooks/${bookid}`, {
        completedBooks: !onCompletedBooks
      })
      .then(() => setOnCompletedBooks(!onCompletedBooks))
      .catch((error) =>
        console.error('Error updating completed books status:', error)
      )
  }

  return (
    <button
      className={`readingStateButton ${onCompletedBooks ? 'onCompletedBooks' : 'offCompletedBooks'}`}
      onClick={toggleReadingState}
    >
      {onCompletedBooks ? 'Completed' : 'Mark as Completed'}
    </button>
  )
}
