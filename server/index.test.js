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