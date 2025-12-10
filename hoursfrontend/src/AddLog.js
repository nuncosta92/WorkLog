import { useState } from "react";
import api from "./api/api";

export default function AddLog({ onAdded }) {
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (start >= end) {
      setError("Start time must be before end time");
      setSuccess("");
      return;
    }

    const total =
      (new Date(`1970-01-01T${end}:00`) - new Date(`1970-01-01T${start}:00`)) /
      3600000;

    try {
      setLoading(true);
      await api.post("/worklogs", {
        date,
        startTime: start,
        endTime: end,
        totalHours: total,
        notes,
      });

      setDate("");
      setStart("");
      setEnd("");
      setNotes("");
      setError("");
      setSuccess("Log added successfully!");
      onAdded();
    } catch (err) {
      console.error(err);
      setError("Failed to add log.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
    >
      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={{ width: "100%", padding: "0.4rem", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </label>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <label style={{ flex: 1 }}>
          Start Time:
          <input
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
            style={{ width: "100%", padding: "0.4rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </label>
        <label style={{ flex: 1 }}>
          End Time:
          <input
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
            style={{ width: "100%", padding: "0.4rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </label>
      </div>

      <label>
        Notes:
        <input
          type="text"
          placeholder="Optional notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ width: "100%", padding: "0.4rem", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </label>

      {/* Error message */}
      {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}

      {/* Success message */}
      {success && <p style={{ color: "green", margin: 0 }}>{success}</p>}

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "0.6rem",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#007bff",
          color: "#fff",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "bold",
          marginTop: "0.5rem",
        }}
      >
        {loading ? "Adding..." : "Add Log"}
      </button>
    </form>
  );
}
