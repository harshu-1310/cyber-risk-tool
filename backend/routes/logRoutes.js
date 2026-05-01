const express = require("express");
const router = express.Router();

const Log = require("../models/Log");
const auth = require("../middleware/authMiddleware"); // ✅ ADD THIS

// 🔒 Protected route
router.get("/", auth, async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.user.id })
      .sort({ loginTime: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;