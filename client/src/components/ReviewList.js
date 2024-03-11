import React, { useState } from 'react';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import '../styles/ReviewList.css'


const ReviewsList = ({ reviews: initialReviews, bookId  }) => {
  
  
  const [reviews, setReviews] = useState(Array.isArray(initialReviews) ? initialReviews : []);
  console.log(reviews);
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

  return (
    <div className="reviews-container">
      <ReviewForm addReview={addReview} bookId={bookId}/>
      {Array.isArray(reviews) && reviews.map((review, index) => (
        <ReviewCard key={index} review={review} addReply={addReply} />
      ))}
    </div>
  );
};

export default ReviewsList;