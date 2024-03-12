/**
 * View a Book's cover and details
 * @param {Book} book - The Book being displayed
 */
import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from 'axios';
import BookDetailsCard from "./BookDetailsCard";
import BookCoverCard from "./BookCoverCard";
import ReviewsList from "./ReviewList";
import "../styles/ViewBook.css"
import ToReadButton from "./ToReadButton";
import HaveReadButton from "./HaveReadButton";

export default function ViewBook() {
    const [loading, setLoading] = useState(true);
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const { book_id } = useParams();
    const location = useLocation().pathname;

    useEffect(() => {
        const fetchBookDetails = async () => {
            console.log("Fetching data....")
            setLoading(true);
            try {
                const response = await axios.get(`/book/${book_id}`);
                console.log(response.data);
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

    // Function to update book details
    const updateBookDetails = async (newBookDetails) => {
        try {
            const response = await axios.put(`/books/${book_id}`, newBookDetails);
            setBook(response.data.book); 
        } catch (error) {
            console.error('Error updating book details:', error);
        }
    };

    return (
        <>
        {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <div className="viewBook">
                    <BookCoverCard book={book} size={"large"} />
                    <div className="readingStateContainer">
                        <ToReadButton book_id={book_id} />
                        <HaveReadButton book_id={book_id} />
                    </div>
                    <BookDetailsCard book={book} updateBookDetails={updateBookDetails} />
                    <ReviewsList reviews={reviews}/>
                </div>
            )
        }
    </>
    );
}
