const sut = require('./book')

const validBook = {
    title: "A Good Book",
    author: "Author Man",
    pages: 250,
    genre: "Action"
}

const invalidBook = {
    title: "A Bad Book",
    pages: 50,
    genre: "Bad"
}

const garbage = {
    jake: {
        fromStateFarm: {
            will: "Remember"
        },
        noMatter: {
            how: "fast you run"
        }
    },
    he: "is faster"
}

test('Valid book returns true', () => {
    expect(sut.validateBook(validBook)).toBe(true)
})

test('Invalid book returns false', () => {
    expect(sut.validateBook(invalidBook)).toBe(false)
})

test('Absolute garbage returns false', () => {
    expect(sut.validateBook(garbage)).toBe(false)
})

test('Created book has all properties', () => {
    const bookUnderTest = sut.createNewBook({title: "A New Book", author: "The New Guy", pages: 100, genre: "Dystopian"})
    expect(!!bookUnderTest.title).toBe(true)
    expect(!!bookUnderTest.author).toBe(true)
    expect(!!bookUnderTest.pages).toBe(true)
    expect(!!bookUnderTest.genre).toBe(true)
})