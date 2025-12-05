import { useState } from "react";
import api from "./api/api";

export default function AddLog({ onAdded }) {
  // Local state for each input field
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [notes, setNotes] = useState("");

  // State for showing success or error messages
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();

    // Calculate total hours between start and end times
    const total =
      (new Date(`1970-01-01T${end}:00`) -
        new Date(`1970-01-01T${start}:00`)) /
      3600000;

    try {
      // Send POST request to backend to save the work log
      await api.post("/worklogs", {
        date,
        startTime: start,
        endTime: end,
        totalHours: total,
        notes,
      });

      // Clear the form inputs after submission
      setDate("");
      setStart("");
      setEnd("");
      setNotes("");

      // Clear any previous error and show success message
      setError(null);
      setMessage("Work log added successfully!");

      // Call parent function to reload the list
      onAdded();

      // Automatically hide success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      // Show error message if request fails
      setError("Error adding work log. Please try again.");
      console.error("Error adding work log:", err);
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      {/* Feedback messages */}
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={submit}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="time"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
        />
        <input
          type="time"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
