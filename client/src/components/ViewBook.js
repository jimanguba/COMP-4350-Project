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
import "../styles/ViewBook.css"


export default function ViewBook() {
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const { book_id } = useParams();

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await axios.get(`/book/${book_id}`);
                console.log(response.data);
                setBook(response.data.book); 
                setReviews(Array.isArray(response.data.reviews) ? response.data.reviews : []);

            } catch (error) {
                console.error(`Error fetching book with identifier ${book_id}:`, error);
            }
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

    // If book is null (not fetched yet or an error occurred), you can return a loading indicator or null
    if (!book) {
        return <div>Book Not Found...</div>;
    }

    return (
        <div className="viewBook">
            <BookCoverCard book={book} size={"large"} />
            <BookDetailsCard book={book} updateBookDetails={updateBookDetails} />
            <ReviewsList reviews={reviews}/>
            
        </div>
        
    );
}
