import axios from 'axios';
import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import ProgressBar from '../components/ProgressBar';
import Calendar from '../components/Calendar';
import Sidebar from '../components/Sidebar';
=======
import StatisticsGoal from '../components/StatisticsGoal';
import StatisticsYear from '../components/StatisticsYear';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/StatisticsCalendar.css';
>>>>>>> sprint-3

function Statistics({ user_id }) {
    const [calendarData, setCalendarData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const onChange = date => {
        setSelectedDate(date);
    };

    const getBookDate = () => {
        if (selectedDate) {
            const matchingData = calendarData.find(d => d.day === selectedDate.toISOString().split('T')[0]);
            if (matchingData) {
                const date = (matchingData.day).split("-");
                const dateDisplay = new Date(date).toDateString();

                return `On ${dateDisplay}...`;
            }
            return 'No book read on selected date';

        }
        return 'Select a date to view book details';
    }

    const getBookDetails = () => {
        if (selectedDate) {
            const matchingData = calendarData.find(d => d.day === selectedDate.toISOString().split('T')[0]);
            if (matchingData) {
                const date = (matchingData.day).split("-");
                const dateDisplay = new Date(date).toDateString();

                return `You read: ${matchingData.book} by ${matchingData.author}`;
            }
        }
    };

    const tileClassName = ({ date }) => {
        const matchingData = calendarData.find(d => d.day === date.toISOString().split('T')[0]);
        if (matchingData) {
            return `book-tile book-tile-${matchingData.value}`;
        }
        return null;
    };

    useEffect(() => {
        // Fetch calendar data
        axios.get(`/users/${user_id}/calendar-data`)
            .then(response => {
                setCalendarData(response.data);
            })
            .catch(error => {
                console.error('Error fetching calendar data:', error);
            });

    }, [user_id]);

    return (
        <div style={{ width: '80vw' }}>
        <Sidebar />
        <div>
            <StatisticsGoal user_id={user_id} />
            <StatisticsYear user_id={user_id} />
            <div className='row'>
                <div className='calendar-wrapper'>
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
                        <li>{getBookDetails()}</li>
                    </ul>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Statistics;
