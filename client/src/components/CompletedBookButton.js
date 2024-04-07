/**
 * Button for adding/removing a book from the user's "completed" list
 * @param {Object} book
 */

import React, { useState, useEffect } from 'react'
import '../styles/ReadingStateButton.css'
import Cookies from 'universal-cookie'
import axios from 'axios'

export default function CompletedBookButton({ book_id }) {
  const cookies = new Cookies(null, { path: '/' })
  const user_id = cookies.get('userID')
  const [onCompletedBooks, setOnCompletedBooks] = useState(false)

  useEffect(() => {
    axios
      .get(`/users/${user_id}/completed_books/${book_id}`)
      .then((response) => {
        setOnCompletedBooks(response.data.completed)
      })
      .catch((error) => console.error('Error fetching completed books:', error))
  }, [])

  const toggleReadingState = () => {
    axios
      .put(`/users/${user_id}/completed_books/${book_id}`, {
        completed_books: !onCompletedBooks
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
