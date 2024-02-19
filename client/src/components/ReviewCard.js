import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/ReviewCard.css';

const ReviewCard = ({ review }) => {
  // Create an array of star elements
  const stars = Array.from({ length: review.rating }, (_, index) => (
    <FontAwesomeIcon key={index} icon={faStar} className="star" />
  ));

  return (
    <div className="review-card">
      <div className="review-header">
        <span className="reviewer-name">{review.reviewer}</span>
        <div className="review-rating">
          {stars}
          {review.verifiedPurchase && (
            <FontAwesomeIcon icon={faCheckCircle} className="verified-purchase-icon" />
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
    </div>
  );
};

export default ReviewCard;
