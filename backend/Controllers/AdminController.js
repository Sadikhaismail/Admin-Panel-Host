const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../Models/Admin");
const VerifyToken = require("../Middleware/VerifyToken");

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const adminUser = await Admin.findOne({ email });
    if (!adminUser) {
      return res.status(400).json({ message: "Email is not registered" });
    }

    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      maxAge: 24 * 60 * 60 * 1000 
    });

    res.json({ message: "Login successful", token });

  } catch (err) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

router.get("/admin", VerifyToken, async (req, res) => {
  try {
    console.log("Admin object from middleware:", req.admin); 

    if (!req.admin) {
      return res.status(400).json({ message: "Admin not found in request" });
    }

    res.json(req.admin);
  } catch (err) {
    console.error("Error fetching admin details:", err);
    res.status(500).json({ message: "Server error" });
  }
});






// Logout Route
router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
});

module.exports = router;