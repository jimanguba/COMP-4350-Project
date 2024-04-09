const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const pool = require('./database')
const cors = require('cors')
const bodyParser = require('body-parser')
const bookUtil = require('./book')
const db = require('./database')

const path = require('path')

const envPath = path.join(__dirname, '.env')
require('dotenv').config({ path: envPath })

const envPathLocal = path.join(__dirname, '.env.local')
require('dotenv').config({ path: envPathLocal })

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

const PORT = process.env.PORT || 5001

app.get('/signup', async (req, res) => {
  let str = req.url
  str = str.substring(2)

  const partsArray = str.split('&')
  const usernameStr = partsArray[0].split('=')
  const passwordStr = partsArray[1].split('=')
  const username = usernameStr[1]
  const password = passwordStr[1]

  const salt = await bcrypt.genSalt(10)

  try {
    const result1 = await pool.query(
      'SELECT count(*) FROM users WHERE userName = $1 GROUP BY userID',
      [username]
    )
    if (result1.rowCount !== 0) {
      await pool.query(
        'SELECT userPassword FROM users WHERE userName = $1',
        [username]
      )
      return res
        .status(400)
        .json({ errors: [{ msg: 'Username Already Taken' }] })
    } else {
      if (password.length >= 5) {
        await pool.query(
          'INSERT INTO users (userName, userPassword) VALUES ($1  ,$2 )',
          [username, await bcrypt.hash(password, salt)]
        )

        const result4 = await pool.query(
          'SELECT userID FROM users WHERE userName = $1',
          [username]
        )

        console.log(result4.rows[0].userID)

        console.log('Login Success')
        res.status(200).json({ data: result4.rows[0].userID })
      } else {
        return res.status(400).json({
          errors: [{ msg: 'Password is too short must be at least length 5' }]
        })
      }
    }
  } catch {
    res.status(500).send('Server error.')
  }
})

app.get('/goalCreate', async (req, res) => {
  try {
    let str = req.url
    str = str.substring(2)

    console.log(req.url)

    const partsArray = str.split('&')
    const textStr = partsArray[0].split('=')
    const statusStr = partsArray[1].split('=')
    const goalNumStr = partsArray[2].split('=')
    const userValStr = partsArray[3].split('=')

    let text = textStr[1]
    const status = statusStr[1]
    const goalNum = goalNumStr[1]
    const userVal = userValStr[1]

    text = text.replace(/\+/g, '%20')
    text = decodeURIComponent(text)

    if (goalNum === '') {
      const result1 = await pool.query(
        'SELECT goalIDToUser FROM goals WHERE userID = $1 ORDER BY goalIDToUser DESC',
        [userVal]
      )
      if (result1.rowCount === 0) {
        pool.query(
          'INSERT INTO goals (userID, goalIDToUser, goalText, goalStatus) VALUES ($1  ,$2 , $3, $4)',
          [userVal, 1, text, status]
        )
      } else {
        const lastValue = result1.rows[0].goalIDToUser
        pool.query(
          'INSERT INTO goals (userID, goalIDToUser, goalText, goalStatus) VALUES ($1  ,$2,$3, $4 )',
          [userVal, lastValue + 1, text, status]
        )
      }
    } else {
      const result2 = await pool.query(
        'SELECT goalID FROM goals WHERE goalIDToUser = $1 AND userID = $2',
        [goalNum, userVal]
      )
      const goalIDFix = result2.rows[0].goalID
      if (result2.rowCount === 0) {
        return res.status(400).json({ errors: [{ msg: "Goal doesn't exist" }] })
      } else {
        pool.query(
          'UPDATE goals SET goalText=$1, goalStatus=$2 WHERE goalID=$3',
          [text, status, goalIDFix]
        )
      }
    }
    res.status(200)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'An error occurred while inserting the goal' })
  }
})

app.get('/getGoals', async (req, res) => {
  try {
    let str = req.url
    str = str.substring(2)

    const partsArray = str.split('&')

    const userValStr = partsArray[0].split('=')
    const userVal = userValStr[1]

    const result1 = await pool.query('SELECT * FROM goals WHERE userID = $1', [
      userVal
    ])

    res.status(200).json(result1.rows)
  } catch (error) {}
})

app.post('/books/new', async (req, res) => {
  try {
    const newData = bookUtil.createNewBook(req.body)
    if (newData) {
      pool.insertBook(newData)
        ? res.status(200).json('Successfully added the book.')
        : res.status(400).json('Failed to insert.')
    } else {
      res.status(400).json('Failed to create a book with the given data')
    }
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'An error occurred while inserting the requested book' })
  }
})

const getBooks = (req, res) => {
  try {
    pool.getAllBooks((error, books) => {
      if (error) {
        throw error
      }
      res.status(200).json(books.rows)
    })
  } catch (error) {}
}

app.get('/books/genre/:genre', async (req, res) => {
  const { genre } = req.params
  const { bookID } = req.query

  try {
    const query = 'SELECT * FROM books WHERE genre = $1 AND bookID != $2'
    const values = [genre, bookID]
    const { rows } = await pool.query(query, values)
    res.json(rows)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching books', error: error.message })
  }
})

app.get('/books', getBooks)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/login', async (req, res) => {
  let str = req.url
  str = str.substring(2)
  const partsArray = str.split('&')
  const usernameStr = partsArray[0].split('=')
  const passwordStr = partsArray[1].split('=')
  const username = usernameStr[1]
  const password = passwordStr[1]

  try {
    const result1 = await pool.query(
      'SELECT userID FROM users WHERE userName = $1',
      [username]
    )
    if (result1.rowCount !== 0) {
      const result2 = await pool.query(
        'SELECT userPassword, userID FROM users WHERE userName = $1',
        [username]
      )
      const pw = result2.rows[0].userpassword

      if (await bcrypt.compare(password, pw)) {
        console.log('Login Success')
        res.status(200).json({ data: result2.rows[0].userid })
      } else {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Incorrect Password or Account Name' }] })
      }
    } else {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Account does not exist' }] })
    }
  } catch {
    res.status(500).send('Server error.')
  }
})

app.get('/book/:bookID', async (req, res) => {
  const { bookID } = req.params
  try {
    const bookData = await pool.getBook(bookID)
    if (!bookData) {
      return res.status(404).json({ message: 'Book not found' })
    }
    const reviewsResult = await pool.query(
      'SELECT * FROM reviews WHERE bookID = $1',
      [bookID]
    )
    const reviewsData = reviewsResult.rows
    res.status(200).json({ book: bookData, reviews: reviewsData })
  } catch (error) {
    console.error(`Error fetching book with identifier ${bookID}:`, error)
    res.status(500).json({
      error:
        'An error occurred while fetching the requested book and its reviews.'
    })
  }
})

app.put('/book/:bookID', async (req, res) => {
  const { bookID } = req.params
  const book = req.body
  try {
    const result = await pool.updateBook(book)
    res.status(200).json({ success: result })
  } catch (error) {
    console.error(`Error updating book with identifier ${bookID}:`, error)
    res
      .status(500)
      .json({ error: 'An error occurred while updating the book.' })
  }
})

app.post('/reviews/new', async (req, res) => {
  const { bookID, userID, rating, comment, reviewTitle, reviewDate, tags } =
    req.body

  if (
    !bookID ||
    !userID ||
    !rating ||
    !comment ||
    !reviewTitle ||
    !reviewDate
  ) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const insertReviewQuery =
      'INSERT INTO reviews (bookID, userID, comment, rating, reviewTitle, reviewDate, tags) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *'

    const newReview = await pool.query(insertReviewQuery, [
      bookID,
      userID,
      comment,
      rating,
      reviewTitle,
      reviewDate,
      tags
    ])

    res.status(201).json(newReview.rows[0])
  } catch (error) {
    console.error('Error inserting new review:', error)
    res
      .status(500)
      .json({ error: 'Error inserting new review', details: error.message })
  }
})

app.get('/user/:userID', async (req, res) => {
  const { userID } = req.params
  try {
    const query = 'SELECT userName FROM users WHERE userID = $1;'
    const result = await pool.query(query, [userID])
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0].userName)
    } else {
      res.status(404).json({ error: 'User not found.' })
    }
  } catch (error) {
    console.error(`Error fetching user with identifier ${userID}:`, error)
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the user name.' })
  }
})

app.get('/books/:userID/average_time', async (req, res) => {
  const { userID } = req.params
  try {
    const result = await pool.query(
      'SELECT ROUND(AVG(readingTime), 2) AS average_time FROM completedBooks where userID = $1',
      [userID]
    )
    const averageTime = result.rows[0].average_time
    res.status(200).json({ average_time: averageTime })
  } catch (error) {
    console.error('Error calculating average reading time:', error.message)
    res.status(500).json({
      error: 'An error occurred while calculating average reading time'
    })
  }
})

app.get('/users/:userID/average_rating', async (req, res) => {
  const { userID } = req.params
  try {
    const result = await pool.query(
      'SELECT AVG(rating) AS average_rating FROM reviews WHERE userID = $1',
      [userID]
    )
    const averageRating = result.rows[0].average_rating
    res.status(200).json({ average_rating: averageRating })
  } catch (error) {
    console.error('Error calculating average rating:', error.message)
    res.status(500).json({ error: 'Error calculating average rating' })
  }
})

app.get('/users/:userID/curr_reading', async (req, res) => {
  const { userID } = req.params
  try {
    const progress = await pool.query(
      'SELECT * FROM curr_reading WHERE userID = $1',
      [userID]
    )
    res.status(200).json(progress.rows)
  } catch (error) {
    console.error('Error fetching progress:', error.message)
    res.status(500).json({ error: 'Error fetching progress' })
  }
})

app.get('/users/:userID/books/num_completed', async (req, res) => {
  const { userID } = req.params
  try {
    const completedBooks = await pool.query(
      'SELECT COUNT(*) FROM completedBooks WHERE userID = $1',
      [userID]
    )
    res.status(200).json(completedBooks.rows)
  } catch (error) {
    console.error('Error fetching completed books for user:', error.message)
    res.status(500).json({ error: 'Error fetching completed books for user' })
  }
})

app.get('/users/:userID', async (req, res) => {
  const { userID } = req.params
  try {
    const user = await pool.query('SELECT * FROM users WHERE userID = $1', [
      userID
    ])
    res.status(200).json(user.rows[0])
  } catch (error) {
    console.error('Error fetching user data:', error.message)
    res.status(500).json({ error: 'Error fetching user data' })
  }
})

app.get('/users/:userID/calendar-data', async (req, res) => {
  try {
    const { userID } = req.params
    const result = await pool.query(
      'SELECT cb.date_end, b.title, b.author FROM completedBooks cb INNER JOIN books b ON cb.bookID = b.bookID WHERE cb.userID = $1',
      [userID]
    )

    const calendarData = result.rows
      .map((row) => {
        if (!isNaN(row.date_end)) {
          return {
            day: row.date_end.toISOString().split('T')[0],
            value: 1,
            book: row.title,
            author: row.author
          }
        } else {
          console.error(`Invalid date value for row with title ${row.title}`)
          return null
        }
      })
      .filter((data) => data !== null)

    res.status(200).json(calendarData)
  } catch (error) {
    console.error('Error fetching calendar data:', error.message)
    res.status(500).json({ error: 'Error fetching calendar data' })
  }
})

app.get('/users/:userID/ToRead', async (req, res) => {
  const { userID } = req.params
  console.log(`getting user (userID ${userID}) to-read list`)
  try {
    const result = await pool.query(
      'SELECT books.* FROM books JOIN wantToRead ON books.bookID = wantToRead.bookID WHERE wantToRead.userID = $1',
      [userID]
    )
    res.status(200).json(result.rows)
  } catch (error) {
    console.error('Error fetching to-read list:', error.message)
    res.status(500).json({ error: 'Error fetching to-read list' })
  }
})

app.get('/users/:userID/ToRead/:bookID', async (req, res) => {
  const { bookID, userID } = req.params
  console.log(
    `Getting status of book (bookID ${bookID}) in user (userID ${userID}) to-read list`
  )
  try {
    const result = await pool.query(
      'SELECT * FROM wantToRead WHERE userID = $1 AND bookID = $2',
      [userID, bookID]
    )
    if (result.rows.length === 0) {
      res.status(200).json({ toRead: false })
    } else {
      res.status(200).json({ toRead: true })
    }
  } catch (error) {
    console.error('Error getting to-read status:', error.message)
  }
})

app.put('/users/:userID/ToRead/:bookID', async (req, res) => {
  const { bookID, userID } = req.params
  const { ToRead } = req.body
  console.log(
    `updating status of book (bookID ${bookID}) in user (userID ${userID}) to-read list`
  )
  if (ToRead) {
    try {
      const result = await pool.query(
        'INSERT INTO wantToRead (bookID, userID) VALUES ($2, $1)',
        [userID, bookID]
      )
      res.status(200).json(result.rows)
    } catch (error) {
      console.error('Error changing to-read status:', error.message)
    }
  } else {
    try {
      const result = await pool.query(
        'DELETE FROM wantToRead WHERE userID = $1 AND bookID = $2',
        [userID, bookID]
      )
      res.status(200).json(result.rows)
    } catch (error) {
      console.error('Error changing to-read status:', error.message)
    }
  }
})

app.get('/users/:userID/completedBooks', async (req, res) => {
  const { userID } = req.params
  console.log(`getting user (userID ${userID}) completed-books list`)
  try {
    const result = await pool.query(
      'SELECT books.* FROM books JOIN completedBooks ON books.bookID = completedBooks.bookID WHERE completedBooks.userID = $1',
      [userID]
    )
    res.status(200).json(result.rows)
  } catch (error) {
    console.error('Error fetching completed-books list:', error.message)
    res.status(500).json({ error: 'Error fetching completed-books list' })
  }
})

app.get('/users/:userID/completedBooks/:bookID', async (req, res) => {
  const { bookID, userID } = req.params
  console.log(
    `getting status of book (bookID ${bookID}) in user (userID ${userID}) completed-books list`
  )
  try {
    const result = await pool.query(
      'SELECT * FROM completedBooks WHERE userID = $1 AND bookID = $2',
      [userID, bookID]
    )
    if (result.rows.length === 0) {
      res.status(200).json({ completed: false })
    } else {
      res.status(200).json({ completed: true })
    }
  } catch (error) {
    console.error('Error getting completed-books status:', error.message)
  }
})

app.put('/users/:userID/completedBooks/:bookID', async (req, res) => {
  const { bookID, userID } = req.params
  const { completedBooks } = req.body

  console.log(
    `updating status of book (bookID ${bookID}) in user (userID ${userID}) completed-books list`
  )
  if (completedBooks) {
    try {
      const result = await pool.query(
        'INSERT INTO completedBooks (bookID, userID) VALUES ($2, $1)',
        [userID, bookID]
      )
      res.status(200).json(result.rows)
    } catch (error) {
      console.error('Error changing completed-books status:', error.message)
    }
  } else {
    try {
      const result = await pool.query(
        'DELETE FROM completedBooks WHERE userID = $1 AND bookID = $2',
        [userID, bookID]
      )
      res.status(200).json(result.rows)
    } catch (error) {
      console.error('Error changing completed-books status:', error.message)
    }
  }
})

app.put('/users/:bookID/readingTime', async (req, res) => {
  const { bookID } = req.params
  const { readingTime } = req.body
  console.log(`updating bookID:${bookID} time to ${readingTime} minutes`)
  try {
    const result = await pool.query(
      'UPDATE books SET readingTime = $1 WHERE bookID = $2 RETURNING *',
      [readingTime, bookID]
    )
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Book not found' })
    } else {
      res.json({ success: true, book: result.rows[0] })
    }
  } catch (error) {
    console.error('Error updating reading time:', error.message)
  }
})

let server
;(async () => {
  server = app.listen(PORT, () => {
    console.log(`Server listening on the port ${PORT}`)
  })
  await db.connectToDatabase()
})().catch((err) => console.log(err))

app.post('/reviews/:reviewID/replies', async (req, res) => {
  const { reviewID } = req.params
  const { userID, replyText } = req.body

  if (!userID || !replyText) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const newReply = await db.insertReply(reviewID, userID, replyText)
    res.status(201).json(newReply.rows[0])
  } catch (error) {
    console.error('Error inserting new reply:', error)
    res
      .status(500)
      .json({ error: 'Error inserting new reply', details: error.message })
  }
})

app.get('/reviews/:reviewID/replies', async (req, res) => {
  const { reviewID } = req.params

  try {
    const replies = await db.getRepliesByReviewId(reviewID)
    res.status(200).json(replies.rows)
  } catch (error) {
    console.error('Error fetching replies for review:', error)
    res.status(500).json({
      error: 'Error fetching replies for review',
      details: error.message
    })
  }
})

app.get('/resetGoals', async (req, res) => {
  try {
    let str = req.url
    str = str.substring(2)

    const partsArray = str.split('&')

    const userValStr = partsArray[0].split('=')
    const userVal = userValStr[1]

    await pool.query('DELETE FROM goals WHERE userID = $1', [
      userVal
    ])
    return res.status(200)
  } catch (error) {}
})

app.get('/changePassword', async (req, res) => {
  let str = req.url
  str = str.substring(2)

  const partsArray = str.split('&')
  const userIdStr = partsArray[0].split('=')
  const passwordStr = partsArray[1].split('=')
  const userId = userIdStr[1]
  const password = passwordStr[1]

  const salt = await bcrypt.genSalt(10)

  try {
    if (password.length >= 5) {
      await pool.query(
        'UPDATE users SET userPassword = $1 WHERE userID = $2',
        [await bcrypt.hash(password, salt), userId]
      )
      console.log('Password Change Success')
      return res.status(200)
    } else {
      return res.status(400).json({
        errors: [{ msg: 'Password is too short must be at least length 5' }]
      })
    }
  } catch {
    res.status(500).send('Server error.')
  }
})

module.exports = {
  server,
  app
}
