import React, { useState } from 'react';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import ReviewFilter from './ReviewFilter'; 
import '../styles/ReviewList.css'


const ReviewsList = ({ reviews: initialReviews, bookId  }) => {
  const [reviews, setReviews] = useState(Array.isArray(initialReviews) ? initialReviews : []);
  const [filter, setFilter] = useState(null);
  
  // console.log(reviews);
  const addReply = (reviewToUpdate, replyText) => {
    setReviews(reviews.map(review => {
      if (review === reviewToUpdate) {
        const updatedReplies = Array.isArray(review.replies) ? [...review.replies, replyText] : [replyText];
        return { ...review, replies: updatedReplies };
      }
      return review;
    }));
  };
  
  const addReview = (newReview) => {
    setReviews([...reviews, newReview]);
  };

  const filteredReviews = filter ? reviews.filter((review) => review.rating === filter) : reviews;

  return (
    <div className="reviews-container">
      <ReviewForm addReview={addReview} bookId={bookId}/>
      <ReviewFilter setFilter={setFilter} />
      {Array.isArray(filteredReviews) && filteredReviews.map((review, index) => (
        <ReviewCard key={index} review={review} addReply={addReply} />
      ))}
    </div>
  );
};

export default ReviewsList;