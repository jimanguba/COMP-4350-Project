CREATE DATABASE bookshelf;

CREATE TABLE books(
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    pages INTEGER,
    genre VARCHAR(255)
);

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(255),
    user_password VARCHAR(255)
);

INSERT INTO books (book_id, title, author, pages, genre) VALUES (1,  'To Kill a Mockingbird', 'Harper Lee', 384,'Thriller');
INSERT INTO books (book_id, title, author, pages, genre) VALUES (2,  '1984', 'George Orwell', 336, 'Science Fiction');
INSERT INTO books (book_id, title, author, pages, genre) VALUES (3,  'Of Mice and Men', 'John Steinbeck', 112,'Tragedy');
INSERT INTO books (book_id, title, author, pages, genre) VALUES (4,  'Macbeth', 'William Shakespeare', 120,'Tragedy');



INSERT INTO users (user_id, user_name, user_password) VALUES (1,  'Harper Lee', 'Thriller');
INSERT INTO users (user_id, user_name, user_password) VALUES (2,  'George Orwell', 'Science Fiction');
INSERT INTO users (user_id, user_name, user_password) VALUES (3,  'John Steinbeck','Tragedy');
INSERT INTO users (user_id, user_name, user_password) VALUES (4,  'William Shakespeare','Tragedy');
