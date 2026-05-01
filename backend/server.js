const helmet = require("helmet");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// 🔒 Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);
app.set("trust proxy", true);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/logs", require("./routes/logRoutes"));

// Test
app.get("/", (req, res) => {
  res.send("🚀 Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});