/**
 * View a Book's cover and details
 * @param {Book} book - The Book being displayed
 */

import BookDetailsCard from "./BookDetailsCard";
import BookCoverCard from "./BookCoverCard";
import "../assets/styles/ViewBook.css"

export default function ViewBook({book}) {

    // Takes a new Book and updates the currentBook
    // (intended for updating a Book's details, rather than actually changing books)
    // _ when we implement the editing of books, this should sent a PUT request 
    // with the new book
    const updateBookDetails = newBookDetails => {
        ;
    }

    console.log(book)

    return (
        <div className="viewBook">
            <BookCoverCard book={book} size={"large"} />
            <BookDetailsCard book={book} updateBookDetails={updateBookDetails} />
        </div>
    )
}