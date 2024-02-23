const Pool = require("pg").Pool;
const bookUtil = require('./book');

let pool = new Pool({
    user: 'postgres',
    password: 'ferrets',
    host: 'localhost',
    port: 5432,
    database: 'bookshelf'
});

if(process.env.PG_CONN_STRING) {
    pool = new Pool({
        connectionString: process.env.PG_CONN_STRING
    })
}

function getAllBooks(params) {
    return pool.query('SELECT * FROM books', params)
}

async function getBook(identifier) {
    queryResult = await pool.query('SELECT * FROM books WHERE book_id = $1', [identifier])
    bookData = queryResult?.rowCount > 0 ? queryResult.rows[0] : null
    return bookUtil.validateBook(bookData) ? bookData : null
}

function insertBook(newBook) {
    return bookUtil.validateBook(newBook) ?
    pool.query(
        `INSERT INTO books(title, author, pages, genre)
        SELECT $1, $2, $3, $4 
        WHERE NOT EXISTS (
            SELECT title,author FROM books 
                WHERE title=$5
                AND author=$6)`
        , [newBook.title, newBook.author, newBook.pages, newBook.genre, newBook.title, newBook.author]
    ) : false
    
}

module.exports = {
    query: (text, params) => pool.query(text, params),
    getAllBooks,
    getBook,
    insertBook
  };
