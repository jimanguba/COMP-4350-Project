/**
 * View a Book's cover and details
 * @param {Book} book - The Book being displayed
 */

import React from "react";
import { useLocation } from "react-router-dom";
import BookDetailsCard from "./BookDetailsCard";
import BookCoverCard from "./BookCoverCard";
import "../styles/ViewBook.css"
import ToReadButton from "./ToReadButton";
import HaveReadButton from "./HaveReadButton";

export default function ViewBook() {

    // Access data passed as state
    const location = useLocation();
    const book = location.state ? location.state.book : null;

    // Takes a new Book and updates the currentBook
    // (intended for updating a Book's details, rather than actually changing books)
    // _ when we implement the editing of books, this should sent a PUT request 
    // with the new book
    const updateBookDetails = newBookDetails => {
        ;
    }

    return (
        <div className="viewBook">
            <BookCoverCard book={book} size={"large"} />
            <div className="readButtonsContainer">
                <ToReadButton book={book} />
                <HaveReadButton book={book} />
            </div>
            <BookDetailsCard book={book} updateBookDetails={updateBookDetails} />
        </div>
    )
}
