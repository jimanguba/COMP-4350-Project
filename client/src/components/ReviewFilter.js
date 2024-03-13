// ReviewFilter.js
import React from 'react';
import '../styles/ReviewFilter.css'

const ReviewFilter = ({ setFilter }) => {
  const handleFilterChange = (event) => {
    // Convert to number if it's a number, otherwise revert to null to show all
    const value = event.target.value === "all" ? null : Number(event.target.value);
    setFilter(value);
  };

  return (
    <div className="review-filter">
      <select onChange={handleFilterChange} defaultValue="all">
        <option value="all">All Reviews</option>
        {[1, 2, 3, 4, 5].map((star) => (
          <option key={star} value={star}>{star} Star{star > 1 ? 's' : ''}</option>
        ))}
      </select>
    </div>
  );
};

export default ReviewFilter;
