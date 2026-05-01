const User = require("../models/User");
const Log = require("../models/Log");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const geoip = require("geoip-lite");
const { detectSuspiciousLogin } = require("../utils/detection");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip;

    const geo = geoip.lookup(ip);
    const location = geo ? geo.country : "Unknown";

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.loginAttempts += 1;

      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000;
      }

      await user.save();
      return res.status(400).json({ msg: "Wrong password" });
    }

    // reset attempts
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // logs
    const logs = await Log.find({ userId: user._id });
    const previousIPs = logs.map(l => l.ip);

    const suspicious = detectSuspiciousLogin(ip, previousIPs);

    await Log.create({
  userId: user._id,
  ip,
  location, // ✅ ADD THIS LINE
  loginTime: new Date(),
  isSuspicious: suspicious
});

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      token,
      message: suspicious ? "⚠️ Suspicious login detected" : "✅ Safe login"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};