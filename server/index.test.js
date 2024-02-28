const sut = require('./index')
const pg = require('pg')
const request = require('supertest')

jest.mock('pg', () => {
    const mockPg = {
        query: jest.fn(),
    };
    return { Pool: jest.fn(() => mockPg) };
});

beforeEach(() => {
    pool = new pg.Pool();
})

afterEach(() => {
    jest.clearAllMocks();
})

afterAll(() => {
    sut.server.close()
})

const exampleBook = {
    "book_id": 1,
    "title": "The Eye of the World",
    "author": "Robert Jordan",
    "pages": 832,
    "genre": "High Fantasy"
}

const notABook = {
    sally: "The salamander",
    has: {
        far: "too many legs"
    }
}

const mockUserId = 1;
const mockAverageTime = 24;
const mockAverageRating = 4.5;
const mockProgress = [{ book_id: 1, progress: 50 }, { book_id: 2, progress: 30 }];
const mockCompletedBooksCount = [{ count: 10 }];
const mockCalendar = [
    { title: 'Book Title 1', date_end: new Date('2024-01-31'), value: 1 },
    { title: 'Book Title 2', date_end: new Date('2024-02-01'), value: 1 },
];

test('Inserting proper book returns status 200 and success message', (done) => {
    pool.query.mockResolvedValue("nil")
    request(sut.app)
        .post('/books/new')
        .send(exampleBook)
        .expect(200)
        .expect(response => {
            expect(response.body).toEqual('Successfully added the book.')
        })
})

test('Inserting improper book returns status 400 and error message', (done) => {
    pool.query.mockResolvedValue("nil")
    request(sut.app)
        .post('/books/new')
        .send(notABook)
        .expect(400)
        .expect(response => {
            expect(response.body).toEqual('Failed to create a book with the given data')
        })
})

//Unit Test 1 - Correct username and password Sign Up
test('Status 200 should be returned', (done) => {
    pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 })
    request(sut.app)
        .get("/signup")
        .query({ username: "kiwi_fruit",password: "kiwi_fruit"})
        .expect(200)
        .end((err, res) => {
            if(err) return done(err)
            return done()
        })
})

//Unit Test 2 - Correct username and password Login 
test('Status 200 should be returned', (done) => {
    pool.query.mockResolvedValueOnce({ rows: [], rowCount: 1 })
    pool.query.mockResolvedValueOnce({ rows: [{user_password: '$2a$10$b.DX3Oqmcdb69ItAhL8J/uFg3RtJEP3hc1Io8KLdZREiwMOw4Tmeu'}], rowCount: 1 })
    request(sut.app)
        .get("/login")
        .query({ username: "testAccount",password: "testAccount"})
        .expect(200)
        .end((err, res) => {
            if(err) return done(err)
            return done()
        })
})

//Unit Test 3 - Sign up with an existing username 
test('Status 400 should be returned', (done) => {
    pool.query.mockResolvedValueOnce({ rows: [], rowCount: 1 })
    request(sut.app)
        .get("/signup")
        .query({ username: "testAccount",password: "testAccount"})
        .expect(400)
        .end((err, res) => {
            if(err) return done(err)
            return done()
        })
})

//Unit Test 4 - Sign up with a new Username but an existing password
test('Status 200 should be returned', (done) => {
    pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 })
    request(sut.app)
        .get("/signup")
        .query({ username: "kiwi_fruit",password: "testAccount"})
        .expect(200)
        .end((err, res) => {
            if(err) return done(err)
            return done()
        })
})

//Unit Test 5 - Login existing Username but wrong password
test('Status 400 should be returned', (done) => {
    pool.query.mockResolvedValueOnce({ rows: [], rowCount: 1 })
    pool.query.mockResolvedValueOnce({ rows: [{user_password: '$2a$10$b.DX3Oqmcdb69ItAhL8J/uFg3RtJEP3hc1Io8KLdZREiwMOw4Tmeu'}], rowCount: 1 })
    request(sut.app)
        .get("/login")
        .query({ username: "testAccount",password: "testAccount2"})
        .expect(400)
        .end((err, res) => {
            if(err) return done(err)
            return done()
        })
})

//Unit Test 6 - Login with not existing username
test('Status 400 should be returned', (done) => {
    pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 })
    request(sut.app)
        .get("/login")
        .query({ username: "testAccount2",password: "testAccount2"})
        .expect(400)
        .end((err, res) => {
            if(err) return done(err)
            return done()
        })
})

//Unit Test 7 - Sign up with existing UN and too short pw
test('Status 400 should be returned', (done) => {
    pool.query.mockResolvedValueOnce({ rows: [], rowCount: 1 })
    request(sut.app)
        .get("/signup")
        .query({ username: "testAccount",password: "test"})
        .expect(400)
        .end((err, res) => {
            if(err) return done(err)
            return done()
        })
})

//Unit Test 8 - Sign up with a new user name and too short a pw
test('Status 400 should be returned', (done) => {
    pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 })
    request(sut.app)
        .get("/signup")
        .query({ username: "testAccount3",password: "test"})
        .expect(400)
        .end((err, res) => {
            if(err) return done(err)
            return done()
        })
})

//Unit Test 9 - Login correct UN and short pw
test('Status 400 should be returned', (done) => {
    pool.query.mockResolvedValueOnce({ rows: [], rowCount: 1 })
    pool.query.mockResolvedValueOnce({ rows: [{user_password: '$2a$10$b.DX3Oqmcdb69ItAhL8J/uFg3RtJEP3hc1Io8KLdZREiwMOw4Tmeu'}], rowCount: 1 })
    request(sut.app)
        .get("/login")
        .query({ username: "testAccount",password: "test"})
        .expect(400)
        .end((err, res) => {
            if(err) return done(err)
            return done()
        })
})

//Unit Test 10 -  Sign up with multiple spaces at start of user name and password
test('Status 200 should be returned', (done) => {
    pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 })
    request(sut.app)
        .get("/signup")
        .query({ username: "        kiwi_fruit",password: "        kiwi_fruit"})
        .expect(200)
        .end((err, res) => {
            if(err) return done(err)
            return done()
        })
})

test('Fetching average reading time returns status 200 and average time', async () => {
    pool.query.mockResolvedValue({ rows: [{ average_time: mockAverageTime }] });
    await request(sut.app)
        .get('/books/average_time')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(response => {
            expect(response.body.average_time).toEqual(mockAverageTime);
        });
});

test('Fetching average rating returns status 200 and average rating', async () => {
    pool.query.mockResolvedValue({ rows: [{ average_rating: mockAverageRating }] });
    await request(sut.app)
        .get(`/users/${mockUserId}/average_rating`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(response => {
            expect(response.body.average_rating).toEqual(mockAverageRating);
        });
});

test('Fetching current reading progress returns status 200 and progress data', async () => {
    pool.query.mockResolvedValue({ rows: mockProgress });
    await request(sut.app)
        .get(`/users/${mockUserId}/curr_reading`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(response => {
            expect(response.body).toEqual(mockProgress);
        });
});

test('Fetching the number of completed books returns status 200 and count', async () => {
    pool.query.mockResolvedValue({ rows: mockCompletedBooksCount });
    await request(sut.app)
        .get(`/users/${mockUserId}/books/num_completed`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(response => {
            expect(response.body).toEqual(mockCompletedBooksCount);
        });
});

test('Fetching calendar data returns status 200 and calendar data', async () => {
    pool.query.mockResolvedValueOnce({ rows: mockCalendar });
    await request(sut.app)
        .get(`/users/${mockUserId}/calendar-data`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(response => {
            expect(response.body.map(({ book, day, value }) => ({ book, day, value }))).toEqual(mockCalendar.map(({ title, date_end, value }) => ({ book: title, day: date_end.toISOString().split('T')[0], value })));
        });
});
