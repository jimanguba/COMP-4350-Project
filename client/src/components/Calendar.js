import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Sidebar from './Sidebar';

const MyCalendar = ({ data }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    const onChange = date => {
        console.log(date);
        setSelectedDate(date);
    };

    const getBookTitle = () => {
        if (selectedDate) {
            const matchingData = data.find(d => d.day === selectedDate.toISOString().split('T')[0]);
            return matchingData ? `You read: ${matchingData.book}` : 'No book read on selected date';
        }
        return 'Select a date to view book title';
    };

    const getColorForBooksRead = value => {
        const colors = [
            '#CAF0F8',
            '#ADE8F4',
            '#90E0EF',
            '#48CAE4',
            '#00B4D8',
            '#0096C7',
            '#0077B6',
            '#023E8A',
            '#03045E'
        ];

        return colors[value % colors.length-1];
    };

    const tileClassName = ({ date }) => {
        const matchingData = data.find(d => d.day === date.toISOString().split('T')[0]);
        if (matchingData) {
            return `book-tile book-tile-${matchingData.value}`;
        }
        return null;
    };

    return (
        <div style={{display: "flex", height: "100vh"}}>
        <div className="calendar-container">
            <div className="calendar-wrapper">
                <h2 className="calendar-heading">Your Reading Calendar</h2>
                <Calendar
                    onChange={onChange}
                    value={selectedDate}
                    tileClassName={tileClassName}
                />
            </div>
            <div className="book-title-wrapper">
                <h3 className="book-title">{getBookTitle()}</h3>
            </div>
            <style>
                {`
                    .book-tile {
                        border-radius: 0;
                    }
                    .book-tile-1 {
                        background-color: ${getColorForBooksRead(1)};
                    }
                    .book-tile-2 {
                        background-color: ${getColorForBooksRead(2)};
                    }
                    /* Add more styles for higher values as needed */
                `}
            </style>
        </div>
        </div>
    );
};

export default MyCalendar;
