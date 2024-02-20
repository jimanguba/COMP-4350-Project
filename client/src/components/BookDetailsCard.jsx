import "../styles/BookDetailsCard.css"

export default function BookDetailsCard({book, updateBookDetails}) {
    return (
        <div>
            <label htmlFor="title">Title</label>
            <br></br>
            <input type="text" id="title" value={book.title}></input>
            <br></br>
            <br></br>
            <label htmlFor="author">Author</label>
            <br></br>
            <input type="text" id="author" value={book.author}></input>
            <br></br>
            <br></br>
            <label htmlFor="pages">Pages</label>
            <br></br>
            <input type="text" id="pages" value={book.pages}></input>
            <br></br>
            <br></br>
            <label htmlFor="genre">Genre</label>
            <br></br>
            <input type="text" id="genre" value={book.genre}></input>
            <br></br>
            <br></br>
        </div>
    )
}
