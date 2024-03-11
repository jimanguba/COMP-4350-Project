import React, { useState, useEffect  } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/ReviewCard.css';
import ReplyForm from '../components/ReplyForm';
import axios from 'axios';


const ReviewCard = ({ review, addReply }) => {
  const [userName, setUserName] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  useEffect(() => {
    // Function to fetch the user name from the API
    const fetchUserName = async () => {
      try {
        const response = await axios.get(`/user/${review.user_id}`);
        setUserName(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching user name:', error);
        setUserName('Anonymous');
      }
    };

    // Call the function if user_id is available
    if (review.user_id) {
      fetchUserName();
    }
  }, [review.user_id]);


  console.log('Review prop in ReviewCard:', review);

  const stars = Array.from({ length: review.rating || 0 }, (_, index) => (<FontAwesomeIcon key={index} icon={faStar} className="star" />));

  

  const submitReply = (replyText) => {
    addReply(review, replyText);
    setShowReplyForm(false);
  };

  // Default tags and replies to an empty array if null
  const tags = Array.isArray(review.tags) ? review.tags : [];
  const replies = Array.isArray(review.replies) ? review.replies : [];

  return (
    <div className="review-card">
      <div className="review-header">
        <span className="reviewer-name">{userName || review.reviewer}</span>
        <div className="review-rating">
          {stars}
          {review.verifiedPurchase && (
            <FontAwesomeIcon icon={faCheckCircle} className="verified-purchase-icon" />
          )}
        </div>
        <span className="review-date">{review.review_date || review.date}</span>
      </div>
      <div className="review-tags">
        {tags.map((tag, index) => (
          <span key={index} className="review-tag">{tag}</span>
        ))}
      </div>
      <div className="review-content">{review.comment || review.content}</div>
      <button onClick={() => setShowReplyForm(!showReplyForm)}>Reply</button>
      {showReplyForm && <ReplyForm submitReply={submitReply} />}
      {replies.map((reply, index) => (
        <div key={index} className="review-reply">
          {reply}
        </div>
      ))}
    </div>
  );
};

export default ReviewCard;