CREATE DATABASE bookshelf;

CREATE TABLE books(
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    pages INTEGER,
    genre VARCHAR(255)
);

INSERT INTO books (book_id, title, author, pages, genre) VALUES (1,  'To Kill a Mockingbird', 'Harper Lee', 384,'Thriller');
INSERT INTO books (book_id, title, author, pages, genre) VALUES (2,  '1984', 'George Orwell', 336, 'Science Fiction');
INSERT INTO books (book_id, title, author, pages, genre) VALUES (3,  'Of Mice and Men', 'John Steinbeck', 112,'Tragedy');
INSERT INTO books (book_id, title, author, pages, genre) VALUES (4,  'Macbeth', 'William Shakespeare', 120,'Tragedy');

ALTER TABLE books ADD COLUMN readingTime INTEGER DEFAULT 0;
