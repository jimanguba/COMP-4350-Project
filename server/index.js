
require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./database");
const bodyParser = require('body-parser');
const bookUtil = require('./book');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// CREATE
app.post("/books/new", async (req, res) => {
    try {
        const newData = bookUtil.createNewBook(req.body)
        if(newData) {
            await pool.insertBook(newData) ? 
                res.status(200).json("Successfully added the book.") : 
                res.status(400).json("Failed to insert.")
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'An error occurred while inserting the requested book' });
    }

})

// READ
const getBooks = (req, res) => {
    try {
        pool.getAllBooks((error, books) => {
            if (error) {
                throw error
            }
            res.status(200).json(books.rows)
        })
    } catch (error) {

    }

}

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get('/books', getBooks)

app.get('/book/:book_id', async (req, res) => {
    const { book_id } = req.params
    try {
        const result = await pool.getBook(book_id)
        res.status(200).json(result)
    } catch (error) {
        console.error(`Error fetching book with identifier ${book_id}`)
        res.status(500).json({ error: 'An error occurred while fetching the requested book.' });
    }
});

app.get('/books/average_time', async (req, res) => {
    try {
        const result = await pool.query('SELECT ROUND(AVG(reading_time), 2) AS average_time FROM completed_books');
        const averageTime = result.rows[0].average_time;

        res.status(200).json({ average_time: averageTime });
    } catch (error) {
        console.error('Error calculating average reading time:', error.message);
        res.status(500).json({ error: 'An error occurred while calculating average reading time' });
    }
});

app.get('/users/:user_id/average_rating', async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await pool.query('SELECT AVG(rating) AS average_rating FROM reviews WHERE user_id = $1', [user_id]);
        const averageRating = result.rows[0].average_rating;
        res.status(200).json({ average_rating: averageRating });
    } catch (error) {
        console.error('Error calculating average rating:', error.message);
        res.status(500).json({ error: 'Error calculating average rating' });
    }
});

app.get('/users/:user_id/curr_reading', async (req, res) => {
    const { user_id } = req.params;
    try {
        const progress = await pool.query('SELECT * FROM curr_reading WHERE user_id = $1', [user_id]);
        res.status(200).json(progress.rows);
    } catch (error) {
        console.error('Error fetching progress:', error.message);
        res.status(500).json({ error: 'Error fetching progress' });
    }
});

app.get('/users/:user_id/books/num_completed', async (req, res) => {
    const { user_id } = req.params;
    try {
        const completedBooks = await pool.query('SELECT COUNT(*) FROM completed_books WHERE user_id = $1', [user_id]);
        res.status(200).json(completedBooks.rows);
    } catch (error) {
        console.error('Error fetching completed books for user:', error.message);
        res.status(500).json({ error: 'Error fetching completed books for user' });
    }
});

app.get('/users/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
        res.status(200).json(user.rows[0]);
    } catch (error) {
        console.error('Error fetching user data:', error.message);
        res.status(500).json({ error: 'Error fetching user data' });
    }
});


// UPDATE
app.put('/users/:book_id/reading_time', async (req, res) => {
    const { book_id } = req.params;
    const { reading_time } = req.body;
    console.log(`updating book_id:${book_id} time to ${reading_time} minutes`)
    try {
        const result = await pool.query('UPDATE books SET reading_time = $1 WHERE book_id = $2 RETURNING *', [reading_time, book_id]);
        if (result.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Book not found' });
        } else {
            res.json({ success: true, book: result.rows[0] });
        }
    } catch (error) {
        console.error('Error updating reading time:', error.message)
    }
});

// DELETE

app.listen(PORT, () => {
    console.log(`Server listening on the port ${PORT}`);
})