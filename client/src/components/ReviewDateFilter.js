import React from "react";
import "../styles/ReviewFilter.css";
const ReviewDateFilter = ({ setDateFilter }) => {
  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  return (
    <div className="review-date-filter">
      <select onChange={handleDateFilterChange} defaultValue="">
        <option value="">All Dates</option>
        <option value="1">Last 24 hours</option>
        <option value="7">Last week</option>
        <option value="30">Last month</option>
      </select>
    </div>
  );
};

export default ReviewDateFilter;
