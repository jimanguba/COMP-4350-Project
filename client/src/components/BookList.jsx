/**
 * Display books in a list
 */

import { useState } from "react"
import { getBooks } from "../lib/requests"
// _ import BookCoverCard from "......"


export default function BookList() {
    const [query, setQuery] = useState("")

    // On loading component, request all books,, displayed alphanumerically
    const books = getBooks()

    // Each list item contains a BookCoverCard, linking to the BookDetailsPage
    return (
        <div>
            <input type="text" placeholder="search titles..." value={query} onChange={e => setQuery(e.target.value)}></input>
            <ul>
                {books.filter(book => book.title.contains(query)).forEach(() => (
                    <a href="......."><li>BOOK COVER</li></a>
                ))}
            </ul>
        </div>
    )
}