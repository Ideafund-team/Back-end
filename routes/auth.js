const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, email, password: hashedPassword });
    res.json({ message: "User berhasil dibuat!", user });
  } catch (err) {
    res.status(400).json({ message: "Gagal mendaftar", error: err });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) return res.status(400).json({ message: "User tidak ditemukan!" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ message: "Password salah!" });

  const token = jwt.sign({ id: user.id }, "secretkey", { expiresIn: "1h" });
  res.json({ token });
});

module.exports = router;
