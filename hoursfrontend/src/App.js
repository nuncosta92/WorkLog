import { useEffect, useState } from 'react';
import api from './api/api';
import AddLog from './AddLog';

function formatHours(h) {
  return Number(h).toFixed(1);
}

// Groups logs into weekly totals (Monday → Sunday) strictly inside the selected month
function groupLogsByWeek(logs, year, month) {
    const result = {};

    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);

    logs.forEach(log => {
        const logDate = new Date(log.date);
        const day = logDate.getDay(); // 0 = Sunday, 1 = Monday...

        // Find Monday
        const monday = new Date(logDate);
        monday.setDate(logDate.getDate() - ((day + 6) % 7));

        // Sunday
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        // Clamp to month boundaries
        const weekStart = new Date(Math.max(monday, monthStart));
        const weekEnd = new Date(Math.min(sunday, monthEnd));

        const key = `${weekStart.toISOString().slice(0,10)} → ${weekEnd.toISOString().slice(0,10)}`;

        if (!result[key]) {
            result[key] = 0;
        }

        result[key] += log.totalHours;
    });

    return result;
}

function App() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);

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

  // Load logs
  const loadData = () => {
    api
      .get("/worklogs", { params: { year, month } })
      .then((res) => {
          setLogs(res.data);
          setWeeklyTotals(groupLogsByWeek(res.data, year, month));
          setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load work logs.");
      });
  };

  useEffect(() => {
    loadData();
  }, [year, month]);

  // Calculate monthly total
  const totalHours = logs.reduce((sum, log) => sum + log.totalHours, 0);

  const [weeklyTotals, setWeeklyTotals] = useState({});


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

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1rem" }}>
        
        {/* Total Monthly Hours */}
        <div style={{ padding: "0.5rem", background: "#e0f7fa", borderRadius: "6px", maxWidth: "200px" }}>
          <h3 style={{ margin: 0 }}>Total Monthly Hours</h3>
          <p style={{ fontSize: "1.2rem", margin: 0 }}>{formatHours(totalHours)}h</p>
        </div>

        {/* Weekly Totals */}
        <div style={{ padding: "0.5rem", background: "#fce4ec", borderRadius: "6px" }}>
          <h3 style={{ margin: 0 }}>Weekly Totals</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" }}>
            {Object.entries(weeklyTotals).map(([weekRange, hours]) => (
              <div
                key={weekRange}
                style={{
                  padding: "1rem",
                  borderRadius: "8px",
                  background: "#ffffff",
                  border: "1px solid #ddd",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                }}
              >
                <h4 style={{ margin: "0 0 0.5rem 0" }}>{weekRange}</h4>
                <p style={{ margin: 0, fontSize: "1.1rem" }}>
                  <strong>{formatHours(hours)}h</strong> worked
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {/* Logs */}
      <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", background: "#fafafa" }}>
        <h3 style={{ marginTop: 0 }}>Logs</h3>
        <ul style={{ paddingLeft: "1.2rem" }}>
          {logs.map((log) => (
            <li key={log.id} style={{ marginBottom: "0.5rem" }}>
              {log.date} → {formatHours(log.totalHours)}h {log.notes && `(${log.notes})`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
