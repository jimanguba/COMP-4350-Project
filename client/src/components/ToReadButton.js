/**
 * Button for adding/removing a book from the user's "to read"
 * @param {Object} book
 */

import React from 'react'
import { useState } from 'react'
import '../styles/ReadingStateButton.css'

export default function ToReadButton({book}) {

    // Init by GETting whether or not this is on to-read list
    const [onToRead, setOnToRead] = useState(false)

    const toggleReadingState = () => {
        ; // Set state and update DB
        console.log("Pressed to-read!")
    }

    return (
        <button className="readingStateButton" onClick={toggleReadingState}>{onToRead ? "Remove from To-Read" : "Add to To-Read"}</button>
    )
}
