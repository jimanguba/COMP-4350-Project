/**
 * Button for adding/removing a book from the user's "to read"
 * @param {Object} book
 */

import React from 'react'
import { useState } from 'react'
import '../styles/ReadingStateButton.css'

export default function ToReadButton({book}) {
    const [onToRead, setOnToRead] = useState(false)

    useEffect(() => {
        axios.get(`/books/${book_id}/to-read`)
            .then(response => {
                const { haveRead } = response.data;
                setOnHaveRead(haveRead);
            })
            .catch(error => {
                console.error('Error fetching to-read:', error);
            })
    }, []);

    const toggleReadingState = () => {
        console.log("Pressed to-read!");
        axios.put(`/books/${book_id}/to-read`, {toRead: !onToRead})
            .then(response => {
                console.log(response.data)
                setOnToRead(response.data.toRead);
            })
            .catch(error => {
                console.error('Error updating to-read status:', error);
            })
    }

    return (
        <button className={`readingStateButton ${onToRead ? "onToRead" : "offToRead"}`} onClick={toggleReadingState}>{onToRead ? "On To-Read" : "Add to To-Read"}</button>
    )
}
