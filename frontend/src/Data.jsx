import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Data.css";

function Data({ data, setPage }) {
  const logout = () => setPage(1);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const formattedDate = selectedDate.toLocaleDateString();
      const res = await fetch(`http://localhost:5000/attendance?date=${formattedDate}`);
      const result = await res.json();
      setFilteredData(result);
    };
    fetchData();
  }, [selectedDate, data]);

  const downloadCSV = () => {
    if (filteredData.length === 0) {
      alert("No data to download");
      return;
    }
    const headers = Object.keys(filteredData[0]).join(",");
    const rows = filteredData.map(d => Object.values(d).join(",")).join("\n");
    const csvContent = headers + "\n" + rows;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "attendance.csv";
    link.click();
  };

  return (
    <div className="data-page">
      <button className="logout" onClick={logout}>Logout</button>

      <div className="data-card">
        <h2>Saved Attendance</h2>
        <div className="date-csv-row">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MM/dd/yyyy"
          />
          <button className="csv-button" onClick={downloadCSV}>CSV</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Emp Code</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((d, i) => (
                <tr key={i}>
                  <td>{d.name}</td>
                  <td>{d.code}</td>
                  <td>{d.date}</td>
                  <td>{d.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No attendance for selected date</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Data;
