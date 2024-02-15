
require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./database");
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// CREATE

// READ
const getBooks =  (req, res) => {
  pool.query('SELECT * FROM books', (error, books) => {
    if (error) {
      throw error
    }
    res.status(200).json(books.rows)
  })
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get('/books', getBooks)

app.get('/books/average_time', async(req, res) => {
  try {
    const result = await pool.query('SELECT reading_time FROM books', [average_time]);
    console.log(result)
    res.json({ average_time: result.rows[0].average_time });
  } catch (error) {
    console.error('Error calculating average reading time:', error.message);
  }
});

// UPDATE
app.put('/books/:book_id/reading_time', async(req, res) => {
  const { book_id } = req.params;
  const { reading_time } = req.body;
  console.log(`updating book_id:${book_id} time to ${reading_time} minutes`)
  try {
    const result = await pool.query(
      'UPDATE books SET reading_time = $1 WHERE book_id = $2 RETURNING *', [reading_time, book_id] 
    );
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