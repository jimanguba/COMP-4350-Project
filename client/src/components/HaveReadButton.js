/**
 * Button for adding/removing a book from the user's "have-read"
 * @param {Object} book
 */

import React, { useState, useEffect } from 'react'
import '../styles/ReadingStateButton.css'
import Cookies from 'universal-cookie'
import axios from 'axios';

export default function HaveReadButton({book_id}) {
    const cookies = new Cookies(null, { path: '/' })
    const user_id = cookies.get('user_id');
    const [onHaveRead, setOnHaveRead] = useState(false)

    useEffect(() => {
        axios.get(`/users/${user_id}/${book_id}`)
            .then(response => {
                const { haveRead } = response.data.haveRead;
                setOnHaveRead(haveRead);
            })
            .catch(error => {
                console.error('Error fetching have-read:', error);
            })
    }, []);

    const toggleReadingState = () => {
        console.log("Pressed have-read!");
        axios.put(`/users/${user_id}/${book_id}`, {haveRead: !onHaveRead})
            .then(response => {
                console.log(response.data)
                setOnToRead(response.data.haveRead);
            })
            .catch(error => {
                console.error('Error updating have-read status:', error);
            })
    }

    return (
        <button className={`readingStateButton ${onHaveRead ? "onHaveRead" : "offHaveRead"}`} onClick={toggleReadingState}>{onHaveRead ? "Already Read" : "Mark as Read"}</button>
    )
}