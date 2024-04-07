class Book {
  constructor(name, writer, pageCount, type) {
    ;(this.title = name),
      (this.author = writer),
      (this.pages = pageCount),
      (this.genre = type)
  }
  static example = new Book(
    'A Darker Shade of Magic',
    'V.E. Schwab',
    400,
    'Fantasy'
  )
}

function createNewBook (data) {
  if (validateBook(data)) {
    return new Book(data.title, data.author, data.pages, data.genre)
  }
  return null
}

function validateBook (book) {
  return (
    !!book?.title &&
    !!book?.author &&
    !!Number.isInteger(book?.pages) &&
    !!book?.genre
  )
}

module.exports = {
  createNewBook,
  validateBook
}
