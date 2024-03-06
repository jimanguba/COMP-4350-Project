CREATE DATABASE bookshelf;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    book_goal INTEGER,
    reviews_id INTEGER,
    want_to_read_id INTEGER,
    curr_reading_id INTEGER
);

CREATE TABLE completed_books (
    completed_id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    reading_time INTEGER,
    date_start DATE,
    date_end DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    comment TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);

CREATE TABLE want_to_read (
    book_id INTEGER,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    PRIMARY KEY (book_id, user_id)
);

CREATE TABLE curr_reading (
    book_id INTEGER,
    user_id INTEGER,
    reading_time INTEGER,
    page_progress INTEGER,
    date_start DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    PRIMARY KEY (book_id, user_id)
);

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

ALTER TABLE reviews ADD COLUMN rating INTEGER;
ALTER TABLE reviews ADD COLUMN review_title VARCHAR(255);
ALTER TABLE reviews ADD COLUMN review_date DATE;

INSERT INTO reviews (book_id, user_id, comment, rating, review_title, review_date) 
VALUES 
(1, 1, 'This is my FAV', 5, 'Lost Within Imagination', '2024-08-15'),
(2, 2, 'A timeless classic that still resonates', 5, 'Timeless Classic', '2024-08-16'),
(3, 3, 'A poignant narrative of friendship and dreams', 4, 'Poignant Narrative', '2024-08-17'),
(4, 4, 'A tragic tale masterfully told', 5, 'Tragic and Masterful', '2024-08-18');


INSERT INTO users (user_id, user_name, user_password) VALUES (1,  'Harper Lee', 'Thriller');
INSERT INTO users (user_id, user_name, user_password) VALUES (2,  'George Orwell', 'Science Fiction');
INSERT INTO users (user_id, user_name, user_password) VALUES (3,  'John Steinbeck','Tragedy');
INSERT INTO users (user_id, user_name, user_password) VALUES (4,  'William Shakespeare','Tragedy');
INSERT INTO users (user_id, book_goal, reviews_id, want_to_read_id, curr_reading_id) VALUES (1, 20, 0, 1, 1);
INSERT INTO completed_books (book_id, user_id, reading_time, date_start, date_end) VALUES (1, 1, 30, '2024-01-01', '2024-01-31');
INSERT INTO reviews (book_id, user_id, comment) VALUES (1, 1, 'My favourite book everrrrrr');
INSERT INTO want_to_read (book_id, user_id) VALUES (4, 1);
