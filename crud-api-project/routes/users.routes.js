const express = require("express");
const User = require("../models/users.model.js");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const router = express.Router();

dotenv.config();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // console.log(req.body)
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });



    if (existingUser)
      return res
        .status(400)
        .json({ message: "username and email already exist!" });

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashPassword });

    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not Found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/logout", async (req, res) => {
  try {
    res.status(500).json({ message: "Logout successfully!" });
  } catch (err) {}
});

module.exports = router;
