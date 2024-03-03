/**
 * Functions making requests to the database
 * 
 * At the moment, very much non-exhaustive, and should probably be heavily 
 * refactored – I just wanted to have something there for people to start using
 */

import axios from 'axios';

// Get all books
export async function getBooks() {
    let data
    try {
        data = await axios.get(`/books`);
    } catch (error) {
        console.log(error.message);
    }
    return data
}

// Get a book's to-read list value
export async function getToRead(book_id) {
    let data
    try {
        data = await axios.get(`/books/${book_id}/to-read`);
    } catch (error) {
        console.log(error.message);
    }
    return data
}

// Update a book's to-read list value
export async function putToRead(book_id) {
    let data
    try {
        data = await axios.put(`/books/${book_id}/to-read`);
    } catch (error) {
        console.log(error.message);
    }
    return data
}   


// Get a book's have-read list value
export async function getHaveRead(book_id) {
    let data
    try {
        data = await axios.get(`/books/${book_id}/have-read`);
    } catch (error) {
        console.log(error.message);
    }
    return data
}

// Update a book's have-read list value 
export async function putHaveRead(book_id) {
    let data
    try {
        data = await axios.put(`/books/${book_id}/have-read`);
    } catch (error) {
        console.log(error.message);
    }
    return data
}