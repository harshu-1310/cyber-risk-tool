import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

  axios.get("http://localhost:5000/api/logs", {
  headers: {
    Authorization: localStorage.getItem("token")
  }
})
  .then(res => setLogs(res.data))
  .catch(err => console.log(err));

  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>📊 Dashboard</h1>

      <button onClick={logout}>Logout</button>

      <h2>Login Logs</h2>

      {logs.map((log, index) => (
        <p key={index}>
          IP: {log.ip} |{" "}
          {log.isSuspicious ? "⚠️ Suspicious" : "✅ Safe"}
        </p>
      ))}
    </div>
  );
}

export default Dashboard;