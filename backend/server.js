const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes (wrap in try-catch safe load)
try {
  const authRoutes = require("./routes/authRoutes");
  const logRoutes = require("./routes/logRoutes");

  app.use("/api/auth", authRoutes);
  app.use("/api/logs", logRoutes);
} catch (err) {
  console.error("❌ Route Load Error:", err);
}

// test route
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// 🔥 SAFE START (VERY IMPORTANT)
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing ❌");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("🔥 SERVER START ERROR:", err);
    process.exit(1); // force crash with visible error
  }
};

startServer();

// crash debugging
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("🔥 Unhandled Rejection:", err);
});