import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import api from './api/api';

function App() {

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api
      	.get("/worklogs", { params: {year: 2025, month: 3}})
        .then((res) => setLogs(res.data))
        .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Work Logs for March 2025</h1>
      <ul>
        {logs.map((l) => (
          <li key={l.id}>
            {l.date} - {l.totalHours} h
          </li>
        ))}
      </ul> 
    </div>
  );
}

export default App;
