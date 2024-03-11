import React, { useState, useEffect  } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarFilled } from '@fortawesome/free-solid-svg-icons';
import '../styles/ReviewForm.css'; // Make sure you have the correct path to your CSS file
import Sidebar from './Sidebar';
import Cookies from 'universal-cookie'; 

// Define the genres or tags for the dropdown
const genres = ['Action', 'Romance', 'Horror', 'Sci-Fi', 'Fantasy', 'Mystery', 'Thriller', 'Biography'];

const ReviewForm = ({ addReview, bookId }) => {
  const [reviewTitle, setReviewTitle] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [userId, setUserId] = useState(''); 

  useEffect(() => {
    const cookies = new Cookies();
    const userIdFromCookie = cookies.get('userID'); // Read the userID cookie
    if (userIdFromCookie) {
      setUserId(userIdFromCookie); // Set the user ID state if the cookie exists
    }
  }, []); 

  const toggleGenre = (genre) => {
    if (selectedTags.includes(genre)) {
      setSelectedTags(selectedTags.filter(tag => tag !== genre));
    } else {
      setSelectedTags([...selectedTags, genre]);
    }
  };
  // console.log("heyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
  // console.log(userId);
  // console.log(bookId);
  const handleSubmit = (event) => {
    event.preventDefault();

    const currentDate = new Date();
    const dateString = `Reviewed on ${currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;

    const newReview = {
      review_title: reviewTitle,
      book_id: bookId,
      user_id: userId,
      rating,
      comment: reviewText,
      //review_title: 
      tags: selectedTags,
      date: dateString,
      //verifiedPurchase: false
    };
    addReview(newReview);
    setReviewTitle('');
    setRating(0);
    setReviewText('');
    setSelectedTags([]);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <input
          className="review-input"
          type="text"
           placeholder="Review Title"
          value={reviewTitle}
          onChange={(e) => setReviewTitle(e.target.value)}
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
{/* 
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
*/}
        <button type="submit" className="submit-btn">Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewForm;