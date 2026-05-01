const express = require("express");
const router = express.Router();

const Log = require("../models/Log"); // 👈 IMPORTANT

// ✅ GET ALL LOGS
router.get("/", async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

module.exports = router;