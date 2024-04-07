const pg = require('pg')
const sut = require('./database')
let pool

const exampleBook = {
  book_id: 1,
  title: 'The Eye of the World',
  author: 'Robert Jordan',
  pages: 832,
  genre: 'High Fantasy',
}

const notABook = {
  sally: 'The salamander',
  has: {
    far: 'too many legs',
  },
}

jest.mock('pg', () => {
  const mockPg = {
    query: jest.fn(),
  }
  return { Pool: jest.fn(() => mockPg) }
})

beforeEach(() => {
  pool = new pg.Pool()
})

afterEach(() => {
  jest.clearAllMocks()
})

test('getAllBooks runs the SELECT all statement with no parameters.', () => {
  sut.getAllBooks()

  expect(pool.query).toBeCalledTimes(1)
  expect(pool.query).toBeCalledWith('SELECT * FROM books', undefined)
})

test('getBook runs the correct SELECT statement with the correct parameter', () => {
  pool.query.mockResolvedValue(exampleBook)
  const result = sut.getBook(1)

  expect(pool.query).toBeCalledTimes(1)
  expect(pool.query).toBeCalledWith('SELECT * FROM books WHERE book_id = $1', [
    1,
  ])
  expect(result == exampleBook)
})

test('getBook recieves invalid book back and returns undefined', () => {
  pool.query.mockResolvedValue(notABook)
  const result = sut.getBook(1)

  expect(pool.query).toBeCalledTimes(1)
  expect(pool.query).toBeCalledWith('SELECT * FROM books WHERE book_id = $1', [
    1,
  ])
  expect(!result)
})

const insertQuery = `INSERT INTO books(title, author, pages, genre)
        SELECT $1, $2, $3, $4 
        WHERE NOT EXISTS (
            SELECT title,author FROM books 
                WHERE title=$5
                AND author=$6)`

test('Insert book with a valid book to return the result of the query', () => {
  pool.query.mockResolvedValue('Successful insertion')
  const result = sut.insertBook(exampleBook)

  expect(pool.query).toBeCalledTimes(1)
  expect(pool.query).toBeCalledWith(insertQuery, [
    'The Eye of the World',
    'Robert Jordan',
    832,
    'High Fantasy',
    'The Eye of the World',
    'Robert Jordan',
  ])
  expect(result === 'Successful insertion')
})

test('Insert book with an invalid book to return false', () => {
  pool.query.mockResolvedValue('This should not be called.')
  const result = sut.insertBook(notABook)

  expect(pool.query).toBeCalledTimes(0)
  expect(!!result).toBe(false)
})
