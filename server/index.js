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
      'SELECT count(*) FROM users WHERE userName = $1 GROUP BY userid',
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
          'SELECT userid FROM users WHERE userName = $1',
          [username]
        )

        console.log(result4.rows[0].userid)

        console.log('Login Success')
        res.status(200).json({ data: result4.rows[0].userid })
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
        'SELECT goalIDToUser FROM goals WHERE userid = $1 ORDER BY goalIDToUser DESC',
        [userVal]
      )
      if (result1.rowCount === 0) {
        pool.query(
          'INSERT INTO goals (userid, goalIDToUser, goalText, goalStatus) VALUES ($1  ,$2 , $3, $4)',
          [userVal, 1, text, status]
        )
      } else {
        const lastValue = result1.rows[0].goalIDToUser
        pool.query(
          'INSERT INTO goals (userid, goalIDToUser, goalText, goalStatus) VALUES ($1  ,$2,$3, $4 )',
          [userVal, lastValue + 1, text, status]
        )
      }
    } else {
      const result2 = await pool.query(
        'SELECT goalID FROM goals WHERE goalIDToUser = $1 AND userid = $2',
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

    const result1 = await pool.query('SELECT * FROM goals WHERE userid = $1', [
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
  const { bookid } = req.query

  try {
    const query = 'SELECT * FROM books WHERE genre = $1 AND bookid != $2'
    const values = [genre, bookid]
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
      'SELECT userid FROM users WHERE userName = $1',
      [username]
    )
    if (result1.rowCount !== 0) {
      const result2 = await pool.query(
        'SELECT userPassword, userid FROM users WHERE userName = $1',
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

app.get('/book/:bookid', async (req, res) => {
  const { bookid } = req.params
  try {
    const bookData = await pool.getBook(bookid)
    if (!bookData) {
      return res.status(404).json({ message: 'Book not found' })
    }
    const reviewsResult = await pool.query(
      'SELECT * FROM reviews WHERE bookid = $1',
      [bookid]
    )
    const reviewsData = reviewsResult.rows
    res.status(200).json({ book: bookData, reviews: reviewsData })
  } catch (error) {
    console.error(`Error fetching book with identifier ${bookid}:`, error)
    res.status(500).json({
      error:
        'An error occurred while fetching the requested book and its reviews.'
    })
  }
})

app.put('/book/:bookid', async (req, res) => {
  const { bookid } = req.params
  const book = req.body
  try {
    const result = await pool.updateBook(book)
    res.status(200).json({ success: result })
  } catch (error) {
    console.error(`Error updating book with identifier ${bookid}:`, error)
    res
      .status(500)
      .json({ error: 'An error occurred while updating the book.' })
  }
})

app.post('/reviews/new', async (req, res) => {
  const { bookid, userid, rating, comment, reviewTitle, reviewDate, tags } =
    req.body

  if (
    !bookid ||
    !userid ||
    !rating ||
    !comment ||
    !reviewTitle ||
    !reviewDate
  ) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const insertReviewQuery =
      'INSERT INTO reviews (bookid, userid, comment, rating, reviewTitle, reviewDate, tags) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *'

    const newReview = await pool.query(insertReviewQuery, [
      bookid,
      userid,
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

app.get('/user/:userid', async (req, res) => {
  const { userid } = req.params
  try {
    const query = 'SELECT userName FROM users WHERE userid = $1;'
    const result = await pool.query(query, [userid])
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0].userName)
    } else {
      res.status(404).json({ error: 'User not found.' })
    }
  } catch (error) {
    console.error(`Error fetching user with identifier ${userid}:`, error)
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the user name.' })
  }
})

app.get('/books/:userid/average_time', async (req, res) => {
  const { userid } = req.params
  try {
    const result = await pool.query(
      'SELECT ROUND(AVG(readingTime), 2) AS average_time FROM completedBooks where userid = $1',
      [userid]
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

app.get('/users/:userid/average_rating', async (req, res) => {
  const { userid } = req.params
  try {
    const result = await pool.query(
      'SELECT AVG(rating) AS average_rating FROM reviews WHERE userid = $1',
      [userid]
    )
    const averageRating = result.rows[0].average_rating
    res.status(200).json({ average_rating: averageRating })
  } catch (error) {
    console.error('Error calculating average rating:', error.message)
    res.status(500).json({ error: 'Error calculating average rating' })
  }
})

app.get('/users/:userid/curr_reading', async (req, res) => {
  const { userid } = req.params
  try {
    const progress = await pool.query(
      'SELECT * FROM curr_reading WHERE userid = $1',
      [userid]
    )
    res.status(200).json(progress.rows)
  } catch (error) {
    console.error('Error fetching progress:', error.message)
    res.status(500).json({ error: 'Error fetching progress' })
  }
})

app.get('/users/:userid/books/num_completed', async (req, res) => {
  const { userid } = req.params
  try {
    const completedBooks = await pool.query(
      'SELECT COUNT(*) FROM completedBooks WHERE userid = $1',
      [userid]
    )
    res.status(200).json(completedBooks.rows)
  } catch (error) {
    console.error('Error fetching completed books for user:', error.message)
    res.status(500).json({ error: 'Error fetching completed books for user' })
  }
})

app.get('/users/:userid', async (req, res) => {
  const { userid } = req.params
  try {
    const user = await pool.query('SELECT * FROM users WHERE userid = $1', [
      userid
    ])
    res.status(200).json(user.rows[0])
  } catch (error) {
    console.error('Error fetching user data:', error.message)
    res.status(500).json({ error: 'Error fetching user data' })
  }
})

app.get('/users/:userid/calendar-data', async (req, res) => {
  try {
    const { userid } = req.params
    const result = await pool.query(
      'SELECT cb.dateend, b.title, b.author FROM completedBooks cb INNER JOIN books b ON cb.bookid = b.bookid WHERE cb.userid = $1',
      [userid]
    )

    const calendarData = result.rows
      .map((row) => {
        if (!isNaN(row.dateend)) {
          return {
            day: row.dateend.toISOString().split('T')[0],
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

app.get('/users/:userid/ToRead', async (req, res) => {
  const { userid } = req.params
  console.log(`getting user (userid ${userid}) to-read list`)
  try {
    const result = await pool.query(
      'SELECT books.* FROM books JOIN wantToRead ON books.bookid = wantToRead.bookid WHERE wantToRead.userid = $1',
      [userid]
    )
    res.status(200).json(result.rows)
  } catch (error) {
    console.error('Error fetching to-read list:', error.message)
    res.status(500).json({ error: 'Error fetching to-read list' })
  }
})

app.get('/users/:userid/ToRead/:bookid', async (req, res) => {
  const { bookid, userid } = req.params
  console.log(
    `Getting status of book (bookid ${bookid}) in user (userid ${userid}) to-read list`
  )
  try {
    const result = await pool.query(
      'SELECT * FROM wantToRead WHERE userid = $1 AND bookid = $2',
      [userid, bookid]
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

app.put('/users/:userid/toRead/:bookid', async (req, res) => {
  const { bookid, userid } = req.params
  const { toRead } = req.body
  console.log(
    `updating status of book (bookid ${bookid}) in user (userid ${userid}) to-read list`
  )
  if (toRead) {
    try {
      const result = await pool.query(
        'INSERT INTO wantToRead (bookid, userid) VALUES ($2, $1)',
        [userid, bookid]
      )
      res.status(200).json(result.rows)
    } catch (error) {
      console.error('Error changing to-read status:', error.message)
    }
  } else {
    try {
      const result = await pool.query(
        'DELETE FROM wantToRead WHERE userid = $1 AND bookid = $2',
        [userid, bookid]
      )
      res.status(200).json(result.rows)
    } catch (error) {
      console.error('Error changing to-read status:', error.message)
    }
  }
})

app.get('/users/:userid/completedBooks', async (req, res) => {
  const { userid } = req.params
  console.log(`getting user (userid ${userid}) completed-books list`)
  try {
    const result = await pool.query(
      'SELECT books.* FROM books JOIN completedBooks ON books.bookid = completedBooks.bookid WHERE completedBooks.userid = $1',
      [userid]
    )
    res.status(200).json(result.rows)
  } catch (error) {
    console.error('Error fetching completed-books list:', error.message)
    res.status(500).json({ error: 'Error fetching completed-books list' })
  }
})

app.get('/users/:userid/completedBooks/:bookid', async (req, res) => {
  const { bookid, userid } = req.params
  console.log(
    `getting status of book (bookid ${bookid}) in user (userid ${userid}) completed-books list`
  )
  try {
    const result = await pool.query(
      'SELECT * FROM completedBooks WHERE userid = $1 AND bookid = $2',
      [userid, bookid]
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

app.put('/users/:userid/completedBooks/:bookid', async (req, res) => {
  const { bookid, userid } = req.params
  const { completedBooks } = req.body

  console.log(
    `updating status of book (bookid ${bookid}) in user (userid ${userid}) completed-books list`
  )
  if (completedBooks) {
    try {
      const result = await pool.query(
        'INSERT INTO completedBooks (bookid, userid) VALUES ($2, $1)',
        [userid, bookid]
      )
      res.status(200).json(result.rows)
    } catch (error) {
      console.error('Error changing completed-books status:', error.message)
    }
  } else {
    try {
      const result = await pool.query(
        'DELETE FROM completedBooks WHERE userid = $1 AND bookid = $2',
        [userid, bookid]
      )
      res.status(200).json(result.rows)
    } catch (error) {
      console.error('Error changing completed-books status:', error.message)
    }
  }
})

app.put('/users/:bookid/readingTime', async (req, res) => {
  const { bookid } = req.params
  const { readingTime } = req.body
  console.log(`updating bookid:${bookid} time to ${readingTime} minutes`)
  try {
    const result = await pool.query(
      'UPDATE books SET readingTime = $1 WHERE bookid = $2 RETURNING *',
      [readingTime, bookid]
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
  const { userid, replyText } = req.body

  if (!userid || !replyText) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const newReply = await db.insertReply(reviewID, userid, replyText)
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

    await pool.query('DELETE FROM goals WHERE userid = $1', [
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
        'UPDATE users SET userPassword = $1 WHERE userid = $2',
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
