/**
 * See and edit a Book's details
 * @param {Book} book - The Book being displayed
 * @param {function} updateBookDetails - Callback to update the Book
 */

import React from 'react'
import axios from 'axios'
import '../styles/BookDetailsCard.css'
import { useState } from 'react'

export default function BookDetailsCard({ book, setBook }) {
  // Are we editing currently? If not, disable inputs and style them properly
  const [editing, setEditing] = useState(false)

  let newBook = {
    title: book.title,
    author: book.author,
    genre: book.genre,
    pages: book.pages,
    book_id: book.book_id,
  }

  const editButtonCallback = async () => {
    console.log('editing:', editing)
    if (editing) {
      try {
        await axios.put(`/book/${newBook.book_id}`, newBook)
        setBook(newBook)
      } catch (error) {
        console.error('Error updating book details:', error)
      }
    }
    setEditing(!editing)
  }

  return (
    <div
      className={
        `bookDetailsCard ` + (editing ? `currentlyEditing` : `disabled`)
      }
    >
      <div className="detail-field">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          disabled={!editing}
          defaultValue={book.title}
          onChange={(e) => (newBook.title = e.target.value)}
        />
      </div>

      <div className="detail-field">
        <label htmlFor="author">Author</label>
        <input
          type="text"
          id="author"
          disabled={!editing}
          defaultValue={book.author}
          onChange={(e) => (newBook.author = e.target.value)}
        />
      </div>

      <div className="detail-field">
        <label htmlFor="pages">Pages</label>
        <input
          type="number"
          id="pages"
          disabled={!editing}
          defaultValue={book.pages}
          onChange={(e) => (newBook.pages = e.target.value)}
        />
      </div>

      <div className="detail-field">
        <label htmlFor="genre">Genre</label>
        <input
          type="text"
          id="genre"
          disabled={!editing}
          defaultValue={book.genre}
          onChange={(e) => (newBook.genre = e.target.value)}
        />
      </div>

      <button className="submit-btn" onClick={editButtonCallback}>
        {!editing ? 'Edit Book Details' : 'Submit Changes'}
      </button>
    </div>
  )
}
