import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';

function Statistics() {
    const [progress, setProgress] = useState(0);
    const [averageReadingTime, setAverageReadingTime] = useState(null);
    const [count, setBooksCompleted] = useState(0);
    const [readingGoal, setReadingGoal] = useState(0); // New state for reading goal
    const yearlyReadingGoal = readingGoal; // Use the fetched reading goal

    useEffect(() => {
        // Fetch user data including reading goal
        axios.get('http://localhost:5000/users/1')
            .then(response => {
                const { book_goal } = response.data;
                setReadingGoal(book_goal);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });

        // Fetch reading progress
        axios.get('http://localhost:5000/users/1/books/num_completed')
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
        axios.get('http://localhost:5000/books/average_time')
            .then(response => {
                setAverageReadingTime(response.data.average_time);
            })
            .catch(error => {
                console.error('Error fetching average reading time:', error);
            });
    }, [yearlyReadingGoal]);

    return (
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
        </div>
    );
}

export default Statistics;
