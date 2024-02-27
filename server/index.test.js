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
        .end((err, res) => {
            if(err) return done(err)
            return done()
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
