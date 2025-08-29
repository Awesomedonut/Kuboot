import React, { useState, useEffect } from 'react';
import './App.css';

interface ApiResponse {
  message: string;
}

function App() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000');
        const data: ApiResponse = await response.json();
        setMessage(data.message);
      } catch (error) {
        setMessage('Failed to connect to API');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kuboot</h1>
        <p>{loading ? 'Loading...' : message}</p>
      </header>
    </div>
  );
}

export default App;
