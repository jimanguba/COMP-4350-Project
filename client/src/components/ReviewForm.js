import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarFilled } from '@fortawesome/free-solid-svg-icons';
import '../styles/ReviewForm.css'; // Make sure you have the correct path to your CSS file
import Sidebar from './Sidebar';

// Define the genres or tags for the dropdown
const genres = ['Action', 'Romance', 'Horror', 'Sci-Fi', 'Fantasy', 'Mystery', 'Thriller', 'Biography'];

const ReviewForm = ({ addReview }) => {
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const toggleGenre = (genre) => {
    if (selectedTags.includes(genre)) {
      setSelectedTags(selectedTags.filter(tag => tag !== genre));
    } else {
      setSelectedTags([...selectedTags, genre]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const currentDate = new Date();
    const dateString = `Reviewed on ${currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;

    const newReview = {
      reviewer: reviewerName,
      rating,
      content: reviewText,
      tags: selectedTags,
      date: dateString,
      verifiedPurchase: false
    };
    addReview(newReview);
    setReviewerName('');
    setRating(0);
    setReviewText('');
    setSelectedTags([]);
  };

  return (
    <div style={{display: "flex", height: "100vh"}}>
    <Sidebar />
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <input
          className="review-input"
          type="text"
          placeholder="Your name"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          required
        />

        <div className="rating">
          {[...Array(5)].map((_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={index < rating ? faStarFilled : faStarEmpty}
              className="star"
              onClick={() => setRating(index + 1)}
            />
          ))}
        </div>

        <textarea
          className="review-input"
          placeholder="Enter your review"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          required
        />

        <div className="genre-buttons">
          {genres.map((genre, index) => (
            <button
              key={index}
              type="button"
              className={`genre-button ${selectedTags.includes(genre) ? 'selected' : ''}`}
              onClick={() => toggleGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        <button type="submit" className="submit-btn">Submit Review</button>
      </form>
    </div>
    </div>
  );
};

export default ReviewForm;
