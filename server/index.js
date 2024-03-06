
require("dotenv").config({ path: __dirname + "/.env" });
require("dotenv").config({ path: __dirname + "/.env.local" });
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const pool = require("./database");
var cors = require('cors');
const bodyParser = require('body-parser');
const bookUtil = require('./book');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5001;

app.get('/signup', async (req, res) => {
  let str = req.url;
  str = str.substring(2)

  var partsArray = str.split('&');
  var usernameStr = partsArray[0].split('=');
  var passwordStr = partsArray[1].split('=');
  var username = usernameStr[1];
  var password = passwordStr[1];

  const salt = await bcrypt.genSalt(10) ;

  try{
    const result1 = await pool.query('SELECT count(*) FROM users WHERE user_name = $1 GROUP BY user_id',[username]);
    if(result1.rowCount!=0) 
    {
      const result2 = await pool.query('SELECT user_password FROM users WHERE user_name = $1',[username]);
      return res.status(400).json({errors: [{msg: "Username Already Taken"}] });
    }
    else  
    {
      if(password.length>=5)
      {
        const result3 = await pool.query('INSERT INTO users (user_name, user_password) VALUES ($1  ,$2 )', [ username, await bcrypt.hash(password, salt)]);
      }
      else
      {
        return res.status(400).json({errors: [{msg: "Password is too short must be at least length 5"}] });
      }
    }
  }
  catch{
    res.status(500).send("Server error.");
  }
  res.json({response: "ok"});
})

// CREATE
app.post("/books/new", async (req, res) => {
    try {
        const newData = bookUtil.createNewBook(req.body)
        if(newData) {
            pool.insertBook(newData) ? 
                res.status(200).json('Successfully added the book.') : 
                res.status(400).json('Failed to insert.')
        } else {
            res.status(400).json('Failed to create a book with the given data')
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

app.get("/books", getBooks)

app.get("/", (req, res) => {
    res.send("Hello World!");
});


app.get('/login', async (req, res) => {
  let str = req.url;
  str = str.substring(2)
  var partsArray = str.split('&');
  var usernameStr = partsArray[0].split('=');
  var passwordStr = partsArray[1].split('=');
  var username = usernameStr[1];
  var password = passwordStr[1];

  try{
    const result1 = await pool.query('SELECT user_id FROM users WHERE user_name = $1',[username]);
    if(result1.rowCount!=0)
    {
      const result2 = await pool.query('SELECT user_password FROM users WHERE user_name = $1',[username]);
      var pw = result2.rows[0].user_password

      if(await bcrypt.compare(password, pw))
      {
        console.log("Login Success")         
      }
      else
      {
        return res.status(400).json({errors: [{msg: "Incorrect Password or Account Name"}] });
      }
    }
    else 
    {
      return res.status(400).json({errors: [{msg: "Account does not exist"}] });
    }
  }
  catch{
    res.status(500).send("Server error.");
  }
  res.json({response: "ok"});
})

/*
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
*/
app.get('/book/:book_id', async (req, res) => {
    const { book_id } = req.params;
    try {
        // Fetch book details using the existing function
        const bookData = await pool.getBook(book_id); // Using the getBook function directly
        //console.log('hey');
        //console.log('bookData', bookData);

        if (!bookData) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Assuming you want to keep the logic to fetch reviews for the book
        const reviewsResult = await pool.query('SELECT * FROM reviews WHERE book_id = $1', [book_id]);
        const reviewsData = reviewsResult.rows;
        //console.log('reviewsData', reviewsData);
        // Send book details and reviews together
        res.status(200).json({ book: bookData, reviews: reviewsData });
    } catch (error) {
        console.error(`Error fetching book with identifier ${book_id}:`, error);
        res.status(500).json({ error: 'An error occurred while fetching the requested book and its reviews.' });
    }
});

app.get('/user/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
      const query = 'SELECT user_name FROM users WHERE user_id = $1;';
      const result = await pool.query(query, [user_id]);
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0].user_name);
      } else {
        res.status(404).json({ error: 'User not found.' });
      }
    } catch (error) {
      console.error(`Error fetching user with identifier ${user_id}:`, error);
      res.status(500).json({ error: 'An error occurred while fetching the user name.' });
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

app.get('/users/:user_id/calendar-data', async (req, res) => {
    try {
        const { user_id } = req.params;
        const result = await pool.query(`
            SELECT cb.date_end, b.title
            FROM completed_books cb
            INNER JOIN books b ON cb.book_id = b.book_id
            WHERE cb.user_id = $1
        `, [user_id]);

        const calendarData = result.rows.map(row => {
            if (!isNaN(row.date_end)) {
                return {
                    day: row.date_end.toISOString().split('T')[0],
                    value: 1,
                    book: row.title
                };
            } else {
                console.error(`Invalid date value for row with title ${row.title}`);
                return null;
            }
        }).filter(data => data !== null);

        res.status(200).json(calendarData);
    } catch (error) {
        console.error('Error fetching calendar data:', error.message);
        res.status(500).json({ error: 'Error fetching calendar data' });
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

const server = app.listen(PORT, () => {
    console.log(`Server listening on the port ${PORT}`);
})

module.exports = {
    server,
    app
}
