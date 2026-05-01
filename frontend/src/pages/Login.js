import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await axios.post(
      "https://cyber-risk-backend-f53q.onrender.com/api/auth/login",
      { email, password }
    );

    localStorage.setItem("token", res.data.token);

    alert("Login successful");
    navigate("/dashboard");

  } catch (err) {
    alert("Login failed");
  }
};
  

  return (
    <div style={{ padding: "50px" }}>
      <h2>Login</h2>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <br /><br />

      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <br /><br />

      <button onClick={handleLogin}>Login</button>

      <p onClick={() => navigate("/register")} style={{ cursor: "pointer" }}>
        Register
      </p>
    </div>
  );
}

export default Login;