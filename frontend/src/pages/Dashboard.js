import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🔒 Redirect if not logged in
    if (!token) {
      navigate("/");
      return;
    }

    // ✅ Correct API call
    axios.get(
      "https://cyber-risk-backend-f53q.onrender.com/api/logs",
      {
        headers: {
          Authorization: `Bearer ${token}`   // ✅ IMPORTANT
        }
      }
    )
    .then((res) => {
      setLogs(res.data);
    })
    .catch((err) => {
      console.error(err);
    });

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

      {logs.length === 0 ? (
        <p>No logs found</p>
      ) : (
        logs.map((log, index) => (
          <p key={index}>
            IP: {log.ip} |{" "}
            {log.isSuspicious ? "⚠️ Suspicious" : "✅ Safe"}
          </p>
        ))
      )}
    </div>
  );
}

export default Dashboard;