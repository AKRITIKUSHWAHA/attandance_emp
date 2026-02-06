// index.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",               // MySQL username
  password: "root",  // MySQL password
  database: "attendancelist_db"
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.log("MySQL Connection Failed:", err);
  } else {
    console.log("MySQL Connected!");

    // Ensure table exists
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS attendance (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50) NOT NULL,
        date VARCHAR(20) NOT NULL,
        time VARCHAR(20) NOT NULL,
        PRIMARY KEY (id)
      )
    `;
    db.query(createTableQuery, (err2) => {
      if (err2) console.log("Table creation failed:", err2);
      else console.log("Attendance table ready!");
    });
  }
});

// POST attendance
app.post("/attendance", (req, res) => {
  const { name, code, date, time } = req.body;

  // Prevent duplicate per day
  db.query(
    "SELECT * FROM attendance WHERE code = ? AND date = ?",
    [code, date],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length > 0) {
        return res.status(400).json({ error: "Attendance already recorded for this employee today!" });
      }

      // Insert new attendance
      db.query(
        "INSERT INTO attendance (name, code, date, time) VALUES (?, ?, ?, ?)",
        [name, code, date, time],
        (err2, result) => {
          if (err2) return res.status(500).json({ error: err2 });
          res.json({ success: true, id: result.insertId });
        }
      );
    }
  );
});

// GET attendance with optional date filter
app.get("/attendance", (req, res) => {
  const { date } = req.query;
  let query = "SELECT * FROM attendance";
  let params = [];
  if (date) {
    query += " WHERE date = ?";
    params.push(date);
  }
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
