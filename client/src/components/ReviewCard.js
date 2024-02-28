import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/ReviewCard.css';
import ReplyForm from '../components/ReplyForm';


const ReviewCard = ({ review, addReply }) => {

  // Create an array of star elements
  const stars = Array.from({ length: review.rating }, (_, index) => (
    <FontAwesomeIcon key={index} icon={faStar} className="star" />
  ));

  const [showReplyForm, setShowReplyForm] = useState(false);

  const submitReply = (replyText) => {
    addReply(review, replyText);
    setShowReplyForm(false);
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <span className="reviewer-name">{review.reviewer}</span>
        <div className="review-rating">
          {stars}
          {review.verifiedPurchase && (
            <FontAwesomeIcon icon={faCheckCircle} className="verified-purchase-icon" data-testid="verified-purchase-icon"/>
          )}
        </div>
        <span className="review-date">{review.date}</span>
      </div>
      <div className="review-tags">
        {review.tags.map((tag, index) => (
          <span key={index} className="review-tag">{tag}</span>
        ))}
      </div>
      <div className="review-content">{review.content}</div>
      <button onClick={() => setShowReplyForm(!showReplyForm)}>Reply</button>
      {showReplyForm && <ReplyForm submitReply={submitReply} />}
      {review.replies?.map((reply, index) => (
        <div key={index} className="review-reply">
          {reply}
        </div>
      ))}
    </div>
  );
};

export default ReviewCard;
