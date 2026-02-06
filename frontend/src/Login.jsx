import { useState } from "react";
import "./Login.css";

function Login({ setPage }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const login = () => {
    if (user === "admin" && pass === "1234") {
      setPage(2);
    } else {
      alert("Wrong ID or Password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>
        <input placeholder="User ID" onChange={e => setUser(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPass(e.target.value)} />
        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}

export default Login;
