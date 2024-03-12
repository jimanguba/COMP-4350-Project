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
    const user_id = cookies.get('userID');
    const [onHaveRead, setOnHaveRead] = useState(false)

    useEffect(() => {
        axios.get(`/users/${user_id}/have_read/${book_id}`)
            .then(response => setOnHaveRead(response.data.toRead))
            .catch(error => console.error('Error fetching have-read:', error))
    }, []);

    const toggleReadingState = () => {
        axios.put(`/users/${user_id}/have_read/${book_id}`, {haveRead: !onHaveRead})
            .then(() => setOnHaveRead(!onHaveRead))
            .catch(error => console.error('Error updating have-read status:', error))
    }

    return (
        <button className={`readingStateButton ${onHaveRead ? "onHaveRead" : "offHaveRead"}`} onClick={toggleReadingState}>{onHaveRead ? "Already Read" : "Mark as Read"}</button>
    )
}
