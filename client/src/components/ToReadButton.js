/**
 * Button for adding/removing a book from the user's "to read" list
 * 
 */

export default function ToReadButton({book}) {

    // Init by GETting whether or not this is on to-read list
    // (__placeholder is false)
    const [onToRead, setOnToRead] = useState(false)

    const toggleToRead = () => {
        ; // Set state and update DB
    }

    return (
        <button className="toReadButton" onClick={toggleToRead} >{onToRead ? "–" : "+"}</button>
    )
}   
