/**
 * Button for adding/removing a book from the user's "have-read"
 * @param {Object} book
 */

import React from 'react'
import { useState } from 'react'
import '../styles/ReadingStateButton.css'
import { getHaveRead, putHaveRead } from '../lib/requests'

export default function HaveReadButton({book}) {

    // Init by GETting whether or not this is on have-read list
    // _ may need to pass user_id
    const [onHaveRead, setOnHaveRead] = useState(getHaveRead(book.id))

    // Update DB, and GET again)
    const toggleReadingState = () => {
        console.log("Pressed have-read!");
        // putHaveRead(book.id);
        // setOnHaveRead(getHaveRead(book.id));
    }

    return (
        <button className={`readingStateButton ${onHaveRead ? "onHaveRead" : "offHaveRead"}`} onClick={toggleReadingState}>{onHaveRead ? "Already Read" : "Mark as Read"}</button>
    )
}
