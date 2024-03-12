import React, { useState } from 'react';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import '../styles/ReviewList.css'


const ReviewsList = ({ reviews: initialReviews }) => {
  
  
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
      <ReviewForm addReview={addReview} />
      {Array.isArray(reviews) && reviews.map((review, index) => (
        <ReviewCard key={index} review={review} addReply={addReply} />
      ))}
    </div>
  );
};

export default ReviewsList;
/*

useState([
    {
      reviewer: "Jamie Lannister",
      rating: 5,
      date: "Reviewed in the United Kingdom on August 15, 2024",
      content: "The Night Circus is a stunning feat of imagination. Morgenstern's world is so enchanting that I was lost within the black-and-white striped tents almost immediately. The story unwinds gracefully, presenting a rivalry that is complex and characters that are both mysterious and compelling. The novel's magical elements are so seamlessly integrated with the narrative that I found myself believing in the impossible. It's a mesmerizing read that left me breathless and eager for more. Highly recommend for anyone who loves fantasy that transcends the genre.",
      verifiedPurchase: true,
      tags: ["Fantasy", "Romance", "Mystery"],
      replies: []
    }
  ]);
*/