import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import BookDetailsCard from './BookDetailsCard'
import BookCoverCard from './BookCoverCard'
import ReviewsList from './ReviewList'
import Sidebar from './Sidebar'
import '../styles/ViewBook.css'
import ToReadButton from './ToReadButton'
import CompletedBookButton from './CompletedBookButton'
import GenreRecommendations from './GenreRecommendations'

export default function ViewBook () {
  const [loading, setLoading] = useState(true)
  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const { bookid } = useParams()

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`/book/${bookid}`)
        setBook(response.data.book)
        console.log('Fetched book details:', response.data.book)
        console.log('Fetched review details:', response.data.reviews)
        const sortedReviews = Array.isArray(response.data.reviews)
          ? response.data.reviews.sort((a, b) => b.rating - a.rating)
          : []
        console.log('Sorted Reviews:', sortedReviews)
        setReviews(sortedReviews)
      } catch (error) {
        console.error(`Error fetching book with identifier ${bookid}:`, error)
        setBook(null) // Setting to null to indicate an error occurred
      }
      setLoading(false)
    }

    fetchBookDetails()
  }, [bookid])

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      {loading
        ? (<p className='text-center'>Loading...</p>)
        : (
          <div className='viewBook'>
            <BookCoverCard book={book} size='large' />
            <div className='readingStateContainer'>
              <ToReadButton bookid={bookid} />
              <CompletedBookButton bookid={bookid} />
            </div>
            <BookDetailsCard book={book} setBook={setBook} />
            {book && book.genre && (
              <GenreRecommendations genre={book.genre} currentBookId={bookid} />
            )}
            <ReviewsList reviews={reviews} bookid={bookid} />
          </div>
          )}
    </div>
  )
}
