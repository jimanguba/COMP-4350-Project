/**
 * Button for adding/removing a book from the user's "to read"
 * @param {Object} book
 */

import React from 'react'
import { useState } from 'react'
import '../styles/ReadingStateButton.css'
import { getToRead, putToRead } from '../lib/requests'

export default function ToReadButton({book}) {

    // Init by GETting whether or not this is on to-read list
    const [onToRead, setOnToRead] = useState(getToRead(book.id))

    // Update DB, and GET again)
    const toggleReadingState = () => {
        console.log("Pressed to-read!");
        // putToRead(book.id);
        // setOnToRead(getToRead(book.id));
    }

    return (
        <button className={`readingStateButton ${onToRead ? "onToRead" : "offToRead"}`} onClick={toggleReadingState}>{onToRead ? "On To-Read" : "Add to To-Read"}</button>
    )
}
