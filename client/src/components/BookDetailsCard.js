/**
 * See and edit a Book's details
 * @param {Book} book - The Book being displayed
 * @param {function} updateBookDetails - Callback to update the Book
 */

import React from "react";
import "../assets/styles/BookDetailsCard.css"
import { useState } from "react"

export default function BookDetailsCard({book, updateBookDetails}) {
    
    // Are we editing currently? If not, disable inputs and style them properly
    const [editing, setEditing] = useState(false)

    console.log(book)

    // "new book" to be built from the input values below, and POSTed
    // as a replacement for the old
    let newBook = {
        title: "",
        author: "",
        genre: "",
        pages: 0,
    }

    const editButtonCallback = () => {
        if (editing)
            updateBookDetails(newBook)
        setEditing(!editing)
    }

    return (
        <div className={`bookDetailsCard ` + (!editing ? `currentlyEditing` : ``)}>
            <label htmlFor="title">Title</label>
            <br></br>
            <input type="text" id="title" value={book.title} onChange={e => newBook.title = e.target.value}></input>
            <br></br>
            <br></br>
            <label htmlFor="author">Author</label>
            <br></br>
            <input type="text" id="author" value={book.author} onChange={e => newBook.author = e.target.value}></input>
            <br></br>
            <br></br>
            <label htmlFor="pages">Pages</label>
            <br></br>
            <input type="number" id="pages" value={book.pages} onChange={e => newBook.pages = e.target.value}></input>
            <br></br>
            <br></br>
            <label htmlFor="genre">Genre</label>
            <br></br>
            <input type="text" id="genre" value={book.genre} onChange={e => newBook.genre = e.target.value}></input>
            <br></br>
            <br></br>
            <button className="submit-btn" onClick={editButtonCallback}>{!editing ? "Edit Book Details" : "Submit Changes"}</button>
        </div>
    )
}
