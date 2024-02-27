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
    const [books, setBooks] = useState()

    getBooks().then(data => setBooks(data | []))

    // Each list item contains a BookCoverCard, linking to the BookDetailsPage
    return (
        <div className="bookList">
            <input type="text" placeholder="search titles..." value={query} onChange={e => setQuery(e.target.value)}></input>
            <ul>
                {books && books.filter(book => book.title.toLowerCase().includes(query.toLowerCase())).map(book => (
                    <Link href="/view-book"><li><BookCoverCard book={book} size={"small"} /></li></Link>
                ))}
            </ul> 
        </div>
    )
}