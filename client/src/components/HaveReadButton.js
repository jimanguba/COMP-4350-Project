/**
 * Button for adding/removing a book from the user's "have-read"
 * @param {Object} book
 */

import React from 'react'
import { useState } from 'react'
import '../styles/ReadingStateButton.css'

export default function HaveReadButton({book_id}) {
    const [onHaveRead, setOnHaveRead] = useState(false)

    useEffect(() => {
        axios.get(`/books/${book_id}/have-read`)
            .then(response => {
                const { haveRead } = response.data;
                setOnHaveRead(haveRead);
            })
            .catch(error => {
                console.error('Error fetching have-read:', error);
            })
    }, []);

    const toggleReadingState = () => {
        console.log("Pressed have-read!");
        axios.put(`/books/${book_id}/have-read`, {haveRead: !onHaveRead})
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
