import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';
import Calendar from '../components/Calendar';
import Sidebar from '../components/Sidebar';

function Statistics({ user_id }) {
    const [progress, setProgress] = useState(0);
    const [averageReadingTime, setAverageReadingTime] = useState(null);
    const [count, setBooksCompleted] = useState(0);
    const [readingGoal, setReadingGoal] = useState(0);
    const [calendarData, setCalendarData] = useState([]);
    const yearlyReadingGoal = readingGoal;

    useEffect(() => {
        // Fetch user data including reading goal
        axios.get(`/users/${user_id}`)
            .then(response => {
                const { book_goal } = response.data;
                setReadingGoal(book_goal);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });

        // Fetch reading progress
        axios.get(`/users/${user_id}/books/num_completed`)
            .then(response => {
                const countData = response.data[0]; // Access the first element of the array
                if (countData && countData.count !== undefined && !isNaN(countData.count)) {
                    const completedBooksCount = parseInt(countData.count);
                    setBooksCompleted(completedBooksCount);
                    setProgress((completedBooksCount / yearlyReadingGoal) * 100);
                } else {
                    console.error('Invalid completedBooks value:', countData.count);
                }
            })
            .catch(error => {
                console.error('Error fetching reading progress:', error);
            });

        // Fetch average reading time
        axios.get('/books/average_time')
            .then(response => {
                setAverageReadingTime(response.data.average_time);
            })
            .catch(error => {
                console.error('Error fetching average reading time:', error);
            });

        // Fetch calendar data
        axios.get(`/users/${user_id}/calendar-data`)
            .then(response => {
                setCalendarData(response.data);
            })
            .catch(error => {
                console.error('Error fetching calendar data:', error);
            });

    }, [yearlyReadingGoal, user_id]);

    return (
        <div style={{display: "flex", height: "100vh"}}>
    <Sidebar />
        <div>
            <h2>Reading Statistics</h2>
            <div>
                <h3>Reading Progress</h3>
                <ProgressBar progress={progress} />
                <p>{count} out of {yearlyReadingGoal} books completed</p>
            </div>
            <div>
                <h3>Average Reading Time</h3>
                <p>{averageReadingTime} minutes</p>
            </div>
            <div style={{ height: '400px' }}>
                <Calendar data={calendarData} />
            </div>
        </div>
        </div>
    );
}

export default Statistics;
