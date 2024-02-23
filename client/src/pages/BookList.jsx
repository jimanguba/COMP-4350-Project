/**
 * Display books in a list
 * 
 * We can make this list very specific (such as, only for a specific user's 
 * lists), by adjusting which Books we GET from the database
 */

import { useState } from "react"
import { getBooks } from "../lib/requests"
import BookCoverCard from "../components/BookCoverCard"
import { Link } from "react-router-dom"
import "../assets/styles/BookList.css"


export default function BookList() {
    const [query, setQuery] = useState("")

    // On loading component, request all books,, displayed alphanumerically
    // const books = getBooks()

    // Placeholder data: __
    const books = [
        {
            title: "Harry P",
            author: "Jk",
            pages: 43,
            genre: "young adult"
        },
        {
            title: "The Catcher in the Rye",
            author: "J.D. Salinger",
            pages: 224,
            genre: "coming-of-age"
        },
        {
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            pages: 281,
            genre: "fiction"
        },
        {
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            pages: 180,
            genre: "classics"
        }
    ]

    // Each list item contains a BookCoverCard, linking to the BookDetailsPage
    return (
        <div className="bookList">
            <input type="text" placeholder="search titles..." value={query} onChange={e => setQuery(e.target.value)}></input>
            <ul>
                {books.filter(book => book.title.toLowerCase().includes(query.toLowerCase())).map(book => (
                    <Link href="/view-book"><li><BookCoverCard book={book} size={"small"} /></li></Link>
                ))}
            </ul>
        </div>
    )
}