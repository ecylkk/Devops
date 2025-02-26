import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [aiResponse, setAiResponse] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAI = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/ai'); // 相对路径，支持 Render
      console.log('AI Response:', res.data);
      setAiResponse(res.data.ai);
    } catch (error) {
      console.error('Fetch Error:', error);
    }
    setLoading(false);
    fetchHistory();
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get('/responses'); // 相对路径
      console.log('History Response:', res.data);
      setHistory(res.data);
    } catch (error) {
      console.error('History Fetch Error:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="app">
      <h1>AI Playground</h1>
      <button onClick={fetchAI} disabled={loading}>
        {loading ? 'Generating...' : 'Get AI Text'}
      </button>
      <p className="response">{aiResponse}</p>
      <h2>Recent Responses</h2>
      <ul className="history">
        {history.map((item, index) => (
          <li key={index}>
            {item.text} <span>(took {item.responseTime}ms)</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;