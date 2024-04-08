CREATE DATABASE bookshelf;

CREATE TABLE users (
    userID SERIAL PRIMARY KEY,
    bookGoal INTEGER,
    reviewsID INTEGER,
    wantToReadID INTEGER,
    currReadingID INTEGER
);

CREATE TABLE completedBooks (
    completedID SERIAL PRIMARY KEY,
    bookID INTEGER NOT NULL,
    userID INTEGER NOT NULL,
    readingTime INTEGER,
    dateStart DATE,
    dateEnd DATE,
    FOREIGN KEY (userID) REFERENCES users(userID),
    FOREIGN KEY (bookID) REFERENCES books(bookID)
);

CREATE TABLE reviews (
    reviewID SERIAL PRIMARY KEY,
    bookID INTEGER NOT NULL,
    userID INTEGER NOT NULL,
    comment TEXT,
    FOREIGN KEY (userID) REFERENCES users(userID),
    FOREIGN KEY (bookID) REFERENCES books(bookID)
);

CREATE TABLE want_to_read (
    bookID INTEGER,
    userID INTEGER,
    FOREIGN KEY (userID) REFERENCES users(userID),
    FOREIGN KEY (bookID) REFERENCES books(bookID),
    PRIMARY KEY (bookID, userID)
);

CREATE TABLE curr_reading (
    bookID INTEGER,
    userID INTEGER,
    readingTime INTEGER,
    pageProgress INTEGER,
    dateStart DATE,
    FOREIGN KEY (userID) REFERENCES users(userID),
    FOREIGN KEY (bookID) REFERENCES books(bookID),
    PRIMARY KEY (bookID, userID)
);

CREATE TABLE books(
    bookID SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    pages INTEGER,
    genre VARCHAR(255)
);

CREATE TABLE users(
    userID SERIAL PRIMARY KEY,
    userName VARCHAR(255),
    userPassword VARCHAR(255)
);

CREATE TABLE goals(
    goalID SERIAL PRIMARY KEY,
    userID INTEGER,
    goalIDToUser INTEGER,
    goalText TEXT,
    goalStatus VARCHAR(255)
);

INSERT INTO books (bookID, title, author, pages, genre) VALUES (1,  'To Kill a Mockingbird', 'Harper Lee', 384,'Thriller');
INSERT INTO books (bookID, title, author, pages, genre) VALUES (2,  '1984', 'George Orwell', 336, 'Science Fiction');
INSERT INTO books (bookID, title, author, pages, genre) VALUES (3,  'Of Mice and Men', 'John Steinbeck', 112,'Tragedy');
INSERT INTO books (bookID, title, author, pages, genre) VALUES (4,  'Macbeth', 'William Shakespeare', 120,'Tragedy');

ALTER TABLE reviews ADD COLUMN rating INTEGER;
ALTER TABLE reviews ADD COLUMN reviewTitle VARCHAR(255);
ALTER TABLE reviews ADD COLUMN reviewDate DATE;

INSERT INTO reviews (bookID, userID, comment, rating, reviewTitle, reviewDate) 
VALUES 
(1, 1, 'This is my FAV', 5, 'Lost Within Imagination', '2024-08-15'),
(2, 2, 'A timeless classic that still resonates', 5, 'Timeless Classic', '2024-08-16'),
(3, 3, 'A poignant narrative of friendship and dreams', 4, 'Poignant Narrative', '2024-08-17'),
(4, 4, 'A tragic tale masterfully told', 5, 'Tragic and Masterful', '2024-08-18');


INSERT INTO users (userID, userName, userPassword) VALUES (1,  'Harper Lee', 'Thriller');
INSERT INTO users (userID, userName, userPassword) VALUES (2,  'George Orwell', 'Science Fiction');
INSERT INTO users (userID, userName, userPassword) VALUES (3,  'John Steinbeck','Tragedy');
INSERT INTO users (userID, userName, userPassword) VALUES (4,  'William Shakespeare','Tragedy');
INSERT INTO users (userID, bookGoal, reviewsID, wantToReadID, currReadingID) VALUES (1, 20, 0, 1, 1);
INSERT INTO reviews (bookID, userID, rating, reviewTitle, comment, reviewDate) VALUES (2, 1, 4, 'Lost Within Imagination', 'My favourite book everrrrrr', '2024-08-15');
INSERT INTO want_to_read (bookID, userID) VALUES (4, 1);

INSERT INTO completed_books (bookID, userID, readingTime, dateStart, dateEnd) VALUES (1, 1, 30, '2024-01-01', '2024-01-31');
INSERT INTO completed_books (bookID, userID, readingTime, dateStart, dateEnd) VALUES (2, 1, 30, '2024-02-01', '2024-03-31');
INSERT INTO completed_books (bookID, userID, readingTime, dateStart, dateEnd) VALUES (3, 1, 100, '2024-02-01', '2024-03-27');
INSERT INTO completed_books (bookID, userID, readingTime, dateStart, dateEnd) VALUES (4, 1, 160, '2024-02-02', '2024-03-25');
