/**
 * Display books in a list
 * 
 * We can make this list very specific (such as, only for a specific user's 
 * lists), by adjusting which Books we GET from the database
 */

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import BookCoverCard from "../components/BookCoverCard"
import { Link } from "react-router-dom"
import "../styles/BookList.css"
import Sidebar from '../components/Sidebar';

export default function BookList() {
    const [query, setQuery] = useState("")
    const [books, setBooks] = useState()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get('/books');
                setBooks(data);
            } catch (error) {
                console.error(error.message);
            }
        }

        fetchData();
    }, []);

    return (
        <div style={{display: "flex", height: "100vh"}}>
        <Sidebar />
        <div className="bookList">
            <input type="text" placeholder="search titles..." value={query} onChange={e => setQuery(e.target.value)}></input>
            <ul>
                {books && books.filter(book => book.title.toLowerCase().includes(query.toLowerCase())).map(book => (
                    <Link key={book.book_id} to={`/view-book/${book.book_id}`}>
                        <li>
                            <BookCoverCard book={book} size={"small"} />
                        </li>
                    </Link>
                ))}
            </ul> 
        </div>
        </div>
    )
}
