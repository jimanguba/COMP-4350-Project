import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import BookCoverCard from './BookCoverCard'
import { Link } from 'react-router-dom'
import '../styles/GenreRecommendations.css'

const GenreRecommendations = ({ genre, currentBookId }) => {
  const [relatedBooks, setRelatedBooks] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const scrollContainerRef = useRef(null)

  const scroll = (scrollOffset) => {
    scrollContainerRef.current.scrollLeft += scrollOffset
  }

  useEffect(() => {
    const fetchRelatedBooks = async () => {
      setIsLoading(true)
      try {
        // Assuming the server will exclude the current book based on the `book_id` query parameter
        const response = await axios.get(`/books/genre/${genre}`, {
          params: { book_id: currentBookId }
        })

        setRelatedBooks(response.data)
      } catch (error) {
        console.error(`Error fetching books from genre '${genre}':`, error)
        setRelatedBooks([])
      }
      setIsLoading(false)
    }

    if (genre && currentBookId) {
      fetchRelatedBooks()
    }
  }, [genre, currentBookId])

  if (isLoading) {
    return <div>Loading related books...</div>
  }

  if (!relatedBooks || relatedBooks.length === 0) {
    return <div>No related books found in this genre.</div>
  }

  return (
    <div>
      <h3>Books You Might Like</h3>
      <button className='scroll-button left' onClick={() => scroll(-300)}>
        &lt;
      </button>
      <div className='genre-recommendations-container' ref={scrollContainerRef}>
        {relatedBooks.map((book) => (
          <div key={book.book_id} className='book-item'>
            <Link to={`/view-book/${book.book_id}`}>
              <BookCoverCard book={book} size='small' />
            </Link>
          </div>
        ))}
      </div>
      <button className='scroll-button right' onClick={() => scroll(300)}>
        &gt;
      </button>
    </div>
  )
}

export default GenreRecommendations
