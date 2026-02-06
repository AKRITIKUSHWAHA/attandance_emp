import { useState } from "react";
import "./Form.css";

function Form({ setPage, setData, existingData }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const submit = async () => {
    if (!name || !code) {
      alert("Please fill all fields");
      return;
    }

    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();

    // frontend duplicate check (same emp + same date)
    const alreadyMarked = existingData.find(
      (item) => item.code === code && item.date === date
    );

    if (alreadyMarked) {
      alert("Attendance already marked for today ❌");
      return;
    }

    const attendanceData = { name, code, date, time };

    try {
      const res = await fetch("http://localhost:5000/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attendanceData),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Attendance saved successfully ✅");
        setData(attendanceData);   // local state update
        setPage(3);                // go to data page
      } else {
        alert(result.error || "Something went wrong ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server error! Backend not running ❌");
    }
  };

  const logout = () => setPage(1);

  return (
    <div className="form-page">
      <button className="logout" onClick={logout}>Logout</button>

      <div className="form-card">
        <h2>Attendance Form</h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Emp Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <p>Date & Time auto set ✔️</p>

        <button className="submit-btn" onClick={submit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default Form;
