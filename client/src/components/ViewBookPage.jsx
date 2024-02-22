/**
 * View a Book's cover and details
 * @param {Book} book - The Book being displayed
 */

import { useState } from "react";
import BookDetailsCard from "./BookDetailsCard";
import BookCoverCard from "./BookCoverCard";
import "../styles/ViewBookPage.css"

export default function ViewBookPage(book) {

    // Does this need to be state? I don't think so
    // We just want the BookCoverCard to rerender when BookDetailsCard inputs
    // are edited
    const [currentBook, setCurrentBook] = useState(book)

    // Takes a new Book and updates the currentBook
    // (intended for updating a Book's details, rather than actually changing books)
    const updateBookDetails = newBookDetails => {
        // _ PUT new book details (a requests function)
        setCurrentBook(newBookDetails)
    }

    return (
        <div>
            <BookCoverCard book={book} size={"large"} />
            <BookDetailsCard book={book} updateBookDetails={updateBookDetails} />
        </div>
    )
}
