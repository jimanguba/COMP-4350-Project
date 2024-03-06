import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Calendar from '../components/StatisticsCalendar';
import StatisticsGoal from '../components/StatisticsGoal';

function StatisticsYear({ user_id }) {
    const [averageReadingTime, setAverageReadingTime] = useState(null);

    useEffect(() => {
        // Fetch average reading time
        axios.get(`/books/${user_id}/average_time`)
            .then(response => {
                setAverageReadingTime(response.data.average_time);
            })
            .catch(error => {
                console.error('Error fetching average reading time:', error);
            });
    }, [user_id]);

    return (
        <div>
            <p>So far, your average reading time is {averageReadingTime} minutes</p>
        </div>
    );
}

export default StatisticsYear;
