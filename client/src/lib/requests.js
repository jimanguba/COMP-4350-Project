/**
 * Functions making requests to the database
 * 
 * At the moment, very much non-exhaustive, and should probably be heavily 
 * refactored – I just wanted to have something there for people to start using
 */

import axios from 'axios';

export async function getBooks() {
    let data
    try {
        data = await axios.get('/books');
    } catch (error) {
        console.log(error.message);
    }
    return data
}

export async function getBook(id) {
    let data
    try {
        data = await axios.get(`/books/${id}`);
    } catch (error) {
        console.log(error.message);
    }
    return data
}
