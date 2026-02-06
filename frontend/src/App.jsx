import { useState } from "react";
import Login from "./Login";
import Form from "./Form";
import Data from "./Data";

function App() {
  const [page, setPage] = useState(1);
  const [attendanceData, setAttendanceData] = useState([]); // frontend copy for immediate display

  const addAttendance = (newData) => {
    setAttendanceData([...attendanceData, newData]);
  };

  return (
    <>
      {page === 1 && <Login setPage={setPage} />}
      {page === 2 && (
        <Form
          setPage={setPage}
          setData={addAttendance}
          existingData={attendanceData}
        />
      )}
      {page === 3 && <Data data={attendanceData} setPage={setPage} />}
    </>
  );
}

export default App;
