import React, { useState } from 'react'
import ReviewCard from './ReviewCard'
import ReviewForm from './ReviewForm'
import ReviewDateFilter from './ReviewDateFilter'
import ReviewFilter from './ReviewFilter'
import '../styles/ReviewList.css'


const ReviewsList = ({ reviews: initialReviews, bookId }) => {
  const [reviews, setReviews] = useState(
    Array.isArray(initialReviews) ? initialReviews : []
  )
  const [filter, setFilter] = useState(null)
  const [dateFilter, setDateFilter] = useState('')

  const addReply = (reviewToUpdate, replyText) => {
    setReviews(
      reviews.map((review) => {
        if (review === reviewToUpdate) {
          const updatedReplies = Array.isArray(review.replies)
            ? [...review.replies, replyText]
            : [replyText]
          return { ...review, replies: updatedReplies }
        }
        return review
      })
    )
  }

  const addReview = (newReview) => {
    setReviews([...reviews, newReview])
  }

  // Function to check if the review was created exactly days ago
  // Function to check if the review was created exactly days ago
  //Removed

  const filteredReviews = reviews
    .filter((review) => !filter || review.rating === filter) // Apply rating filter if set
    .filter((review) => applyDateFilter(review, dateFilter)) // Apply date filter

  return (
    <div className='reviews-container'>
      <ReviewForm addReview={addReview} bookId={bookId} />
      <div
        style={{
          display: 'flex',
          justifycontent: 'flex-end',
          marginbottom: '20px',
          alignitems: 'right'
        }}
      >
        <ReviewFilter setFilter={setFilter} />
        <ReviewDateFilter setDateFilter={setDateFilter} />
      </div>
      {filteredReviews.map((review, index) => (
        <ReviewCard key={index} review={review} addReply={addReply} />
      ))}
    </div>
  )
}

export default ReviewsList
