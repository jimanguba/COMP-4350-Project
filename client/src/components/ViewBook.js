/**
 * View a Book's cover and details
 * @param {Book} book - The Book being displayed
 */

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import BookDetailsCard from "./BookDetailsCard";
import BookCoverCard from "./BookCoverCard";
import ReviewsList from "./ReviewList";
import Sidebar from "./Sidebar";
import "../styles/ViewBook.css"
import ToReadButton from "./ToReadButton";
import CompletedBookButton from "./CompletedBookButton";

export default function ViewBook() {
    const [loading, setLoading] = useState(true);
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const { book_id } = useParams();

    useEffect(() => {
        const fetchBookDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/book/${book_id}`);
                setBook(response.data.book); 
                setReviews(Array.isArray(response.data.reviews) ? response.data.reviews : []);
            } catch (error) {
                console.error(`Error fetching book with identifier ${book_id}:`, error);
                setBook({title: "No book selected", author: "No author", pages: 0, genre: "No genre" })
            }
            setLoading(false);
        };
    
        fetchBookDetails();
    }, [book_id]);

    return (
        <>
            <Sidebar />
        {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <div className="viewBook">
                    <BookCoverCard book={book} size={"large"} />
                    <div className="readingStateContainer">
                        <ToReadButton book_id={book_id} />
                        <CompletedBookButton book_id={book_id} />
                    </div>
                    <BookDetailsCard book={book} setBook={setBook} />
                    <ReviewsList reviews={reviews} bookId={book_id}/>
                </div>
            )
        }
    </>
    );
}
