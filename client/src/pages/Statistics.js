import axios from "axios";
import React, { useState, useEffect } from "react";
import StatisticsGoal from "../components/StatisticsGoal";
import StatisticsYear from "../components/StatisticsYear";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/StatisticsCalendar.css";
import Sidebar from "../components/Sidebar";

function Statistics({ user_id }) {
  const [calendarData, setCalendarData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookDetails, setBookDetails] = useState("");
  const [bookImage, setBookImage] = useState("");

  const onChange = (date) => {
    setSelectedDate(date);
  };

  const getBookDate = () => {
    if (selectedDate) {
      const matchingData = calendarData.find(
        (d) => d.day === selectedDate.toISOString().split("T")[0],
      );
      if (matchingData) {
        const date = matchingData.day.split("-");
        const dateDisplay = new Date(date).toDateString();
        return `On ${dateDisplay}...`;
      } else {
        return "No book read on selected date";
      }
    }
    return "Select a date to view book details";
  };
  const getBookDetails = async () => {
    if (selectedDate) {
      const matchingData = calendarData.find(
        (d) => d.day === selectedDate.toISOString().split("T")[0],
      );
      if (matchingData) {
        const { book, author } = matchingData;
        setBookDetails(`You read: ${book} by ${author}`);
        const query = `${book} ${author}`;
        const encodedQuery = encodeURIComponent(query);

        try {
          const response = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&key=AIzaSyAbhwnp3JTNJFChJXIFMNmiKCPnoGLeQ44`,
          );
          const items = response.data.items;
          if (items && items.length > 0) {
            const firstItem = items[0];
            const bookCover = firstItem.volumeInfo.imageLinks?.thumbnail;
            if (bookCover) {
              setBookImage(bookCover);
            }
          }
        } catch (error) {
          console.error("Error fetching book details:", error);
          setBookDetails("Failed to fetch book details");
          setBookImage("");
        }
      } else {
        setBookDetails("");
        setBookImage("");
      }
    }
  };

  const tileClassName = ({ date }) => {
    const matchingData = calendarData.find(
      (d) => d.day === date.toISOString().split("T")[0],
    );
    if (matchingData) {
      return `book-tile book-tile-${matchingData.value}`;
    }
    return null;
  };

  useEffect(() => {
    // Fetch calendar data
    axios
      .get(`/users/${user_id}/calendar-data`)
      .then((response) => {
        setCalendarData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching calendar data:", error);
      });
  }, [user_id]);

  useEffect(() => {
    getBookDetails();
  }, [selectedDate, calendarData]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div>
        <StatisticsGoal user_id={user_id} />
        <StatisticsYear user_id={user_id} />
        <div className="row">
          <div className="calendar-wrapper">
            <h2>Your Reading Calendar</h2>
            <Calendar
              onChange={onChange}
              value={selectedDate}
              tileClassName={tileClassName}
            />
          </div>
          <div className="book-title-wrapper">
            <h3 className="book-title">{getBookDate()}</h3>
            <ul>
              <li>{bookDetails}</li>
              {bookImage ? (
                <li>
                  <img
                    src={bookImage}
                    alt="Book Cover"
                    className="book-cover"
                  />
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
