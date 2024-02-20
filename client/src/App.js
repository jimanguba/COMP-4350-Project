
import './App.css';
import axios from 'axios';
import React, {useState, useEffect} from 'react';

import ViewBookPage from './components/ViewBookPage';

function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () =>{
      setLoading(true);
      try {
        const {data: response} = await axios.get('/books');
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
        <ViewBookPage />
    </div>
  )};

export default App;

