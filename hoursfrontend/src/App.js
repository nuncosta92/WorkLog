import { useEffect, useState } from 'react';
import api from './api/api';
import AddLog from './AddLog';

// Helper function to get start and end date of the ISO week
function getWeekStartEnd(dateString) {
  const date = new Date(dateString);
  const day = date.getDay() || 7; // Sunday = 7
  const start = new Date(date);
  start.setDate(date.getDate() - day + 1); // Monday
  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Sunday

  // Format as YYYY-MM-DD
  const format = (d) => d.toISOString().split('T')[0];

  return { start: format(start), end: format(end) };
}

function App() {
  // State
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);

  // Dropdown options
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Load data
  const loadData = () => {
    api
      .get("/worklogs", { params: { year, month } })
      .then((res) => {
        setLogs(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching logs:", err);
        setError("Failed to load work logs.");
      });
  };

  useEffect(() => {
    loadData();
  }, [year, month]);

  // Totals
  const totalHours = logs.reduce((sum, log) => sum + log.totalHours, 0);
  const weeklyTotals = logs.reduce((acc, log) => {
    const { start, end } = getWeekStartEnd(log.date);
    const key = `${start} → ${end}`;
    acc[key] = (acc[key] || 0) + log.totalHours;
    return acc;
  }, {});

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Worked Hours</h1>

      {/* Filters */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", justifyContent: "center" }}>
        <label>
          Year:{" "}
          <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </label>

        <label>
          Month:{" "}
          <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
            {months.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Form */}
      <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", background: "#f9f9f9" }}>
        <AddLog onAdded={loadData} />
      </div>

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ flex: 1, padding: "0.5rem", background: "#e0f7fa", borderRadius: "6px" }}>
          <h3 style={{ margin: 0 }}>Total Monthly Hours</h3>
          <p style={{ fontSize: "1.2rem", margin: 0 }}>{totalHours}h</p>
        </div>

        <div style={{ flex: 2, padding: "0.5rem", background: "#fce4ec", borderRadius: "6px" }}>
          <h3 style={{ margin: 0 }}>Weekly Totals</h3>
          <ul style={{ margin: "0.5rem 0 0 0", paddingLeft: "1.2rem" }}>
            {Object.entries(weeklyTotals).map(([weekRange, hours]) => (
              <li key={weekRange}>{weekRange}: {hours}h</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Error */}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {/* List of logs */}
      <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", background: "#fafafa" }}>
        <h3 style={{ marginTop: 0 }}>Logs</h3>
        <ul style={{ paddingLeft: "1.2rem" }}>
          {logs.map((log) => (
            <li key={log.id} style={{ marginBottom: "0.5rem" }}>
              {log.date} → {log.totalHours}h {log.notes && `(${log.notes})`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
