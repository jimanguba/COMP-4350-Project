
require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./database");

const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
    console.log(`Server listening on the port  ${PORT}`);
})