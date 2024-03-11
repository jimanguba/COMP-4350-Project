import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';

function StatisticsGoal({ user_id }) {
    const [progress, setProgress] = useState(0);
    const [count, setBooksCompleted] = useState(0);
    const [readingGoal, setReadingGoal] = useState(0);
    const [username, setUsername] = useState(0);
    const yearlyReadingGoal = readingGoal;

    useEffect(() => {
        // Fetch user data including reading goal
        axios.get(`/users/${user_id}`)
            .then(response => {
                const { book_goal, user_name } = response.data;
                setReadingGoal(book_goal);
                setUsername(user_name);
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
    }, [yearlyReadingGoal, user_id]);

    return (
        <div>
            <h2>{username}'s Reading Statistics</h2>
            <div>
                <h3>Your Yearly Reading Goal: {progress >= 100 ? "Congratulations! You've reached your yearly reading goal!" : `Keep going! You're ${progress}% there!`}</h3>
                <ProgressBar progress={progress} />
                <p>{count} out of {yearlyReadingGoal} books completed</p>
            </div>
        </div>
    );
}

export default StatisticsGoal;
