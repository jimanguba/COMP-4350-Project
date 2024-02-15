
import './App.css';
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () =>{
      console.log("Fetching data....")
      setLoading(true);
      try {
        const {data: response} = await axios.get('http://localhost:5000/books');
        setData(response);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  return (
    <div className='container my-5' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Pages</th>
            <th>Genre</th>
          </tr>
          </thead>
          <tbody>
            { data.map(item => (
              <tr key={item.book_id}>
                <td>{item.book_id}</td>
                <td>{item.title}</td>
                <td>{item.author}</td>
                <td>{item.pages}</td>
                <td>{item.genre}</td>
              </tr>
            ))}
          </tbody>
        </table> 
      </div>
  )};

export default App;

