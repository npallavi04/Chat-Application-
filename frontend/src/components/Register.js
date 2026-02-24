import { useState } from "react";
import axios from "axios";
import { API_URL } from "../api";

function Register({ setUser }) {  // must receive setUser from App.js
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      const res = await axios.post(`${API_URL}/register`, { username, password });
      if (res.data.success) {
        alert("Registered successfully! Logging in...");
        localStorage.setItem("user", username);
        setUser(username); // automatically login
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="register">
      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={register}>Register</button>
    </div>
  );
}

export default Register;
