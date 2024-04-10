/**
 * Display books in a list
 *
 * We can make this list very specific (such as, only for a specific user's
 * lists), by adjusting which Books we GET from the database
 */

import axios from 'axios'
import React, { useState, useEffect } from 'react'
import BookCoverCard from '../components/BookCoverCard'
import { Link } from 'react-router-dom'
import '../styles/BookList.css'
import Sidebar from '../components/Sidebar'
import Cookies from 'universal-cookie'

export default function BookList ({ type }) {
  const cookies = new Cookies(null, { path: '/' })
  const userid = cookies.get('userID')
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (type === 'all') {
          const { data } = await axios.get('/books')
          setBooks(data)
        } else if (type === 'completed') {
          const { data } = await axios.get(`/users/${userid}/completedBooks`)
          setBooks(data)
        } else if (type === 'to-read') {
          const { data } = await axios.get(`/users/${userid}/toRead`)
          setBooks(data)
        }
      } catch (error) {
        console.error(error.message)
      }
    }

    fetchData()
  }, [type])

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div className='bookList'>
        {
          type === 'all'
            ? (<h1>All Books</h1>)
            : type === 'completed'
              ? (<h1>Completed Books</h1>)
              : type === 'to-read'
                ? (<h1>Want To Read</h1>)
                : (<h1>Books</h1>)
        }
        <input
          type='text'
          placeholder='search titles...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ul>
          {books &&
            books
              .filter((book) => {
                if (book.title) {
                  return book.title.toLowerCase().includes(query.toLowerCase())
                }
                return false
              })
              .map((book) => (
                <Link key={book.bookid} to={`/view-book/${book.bookid}`}>
                  <li>
                    <BookCoverCard book={book} size='small' />
                  </li>
                </Link>
              ))}
        </ul>
      </div>
    </div>
  )
}
