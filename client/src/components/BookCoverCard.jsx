/**
 * Display a Book's cover
 * @param {Book} book - The Book whose cover being displayed
 * @param {string} size - Specifying the size of the Book cover
 * 
 * Should we put the link that links to the book's details page here?
 * Or should we leave that to the containing component?
 */

import "../assets/styles/BookCoverCard.css"

export default function BookCoverCard({book, size}) {

    // Two standard sizes for BookCoverCard:
    // - small: when displayed in a list or on a shelf
    // - large: when displayed on a ViewBookPage
    // Size is "large" or "small", defaulting to "small"
    return (
        <div className={`bookCoverCard ` + (size === "large" ? `large` : `small`)}>
            <p className="title">{book.title}</p>
        </div>
    )
}