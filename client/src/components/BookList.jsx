/**
 * Display books in a list
 */

import { useState } from "react"
// _ import BookCoverCard from "......"

export default function BookList() {
    const [books, setBooks] = useState([])
    const [query, setQuery] = useState("")

    return (
        <div>
            <input type="text" placeholder="search titles..." value={query} onChange={e => setQuery(e.target.value)}></input>
            <ul>
                {books.filter(book => book.title.contains(query)).forEach(() => (
                    <a href="......."><li>THIS IS WHERE THE BOOK GOES</li></a>
                ))}
            </ul>
        </div>
    )
}