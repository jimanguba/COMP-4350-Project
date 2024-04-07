/**
 * Button for adding/removing a book from the user's "to read"
 * @param {Object} book
 */

import React, { useState, useEffect } from "react";
import "../styles/ReadingStateButton.css";
import Cookies from "universal-cookie";
import axios from "axios";

export default function ToReadButton({ book_id }) {
  const cookies = new Cookies(null, { path: "/" });
  const user_id = cookies.get("userID");
  const [onToRead, setOnToRead] = useState(false);

  useEffect(() => {
    axios
      .get(`/users/${user_id}/to_read/${book_id}`)
      .then((response) => setOnToRead(response.data.toRead))
      .catch((error) => console.error("Error fetching to-read:", error));
  }, []);

  const toggleReadingState = () => {
    axios
      .put(`/users/${user_id}/to_read/${book_id}`, { to_read: !onToRead })
      .then(() => setOnToRead(!onToRead))
      .catch((error) => console.error("Error updating to-read status:", error));
  };

  return (
    <button
      className={`readingStateButton ${onToRead ? "onToRead" : "offToRead"}`}
      onClick={toggleReadingState}
    >
      {onToRead ? "On To-Read" : "Add to To-Read"}
    </button>
  );
}
