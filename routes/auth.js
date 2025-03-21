const express = require("express");
const router = express.Router();
const upload = require('../middleware/upload');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");

router.post("/register", upload.fields([{ name: "foto_profil" }, { name: "foto_ktp" }]), async (req, res) => {
  const {
    email,
    password,
    confirm_password,
    nama,
    alamat,
    no_hp,
  } = req.body;

  // Validasi password
  if (password !== confirm_password) {
    return res.status(400).json({ message: "Konfirmasi Password tidak cocok." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Cek apakah email sudah terdaftar
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: "Email sudah terdaftar." });
  }

  // Validasi foto_ktp dan foto_profil wajib diisi
  if (!req.files || !req.files["foto_ktp"] || !req.files["foto_profil"]) {
    return res.status(400).json({ message: "Foto KTP dan Foto Profil wajib diunggah." });
  }

  // Upload foto_profil ke Cloudinary
  let foto_profil = null;
  try {
    const result = await cloudinary.uploader.upload(`data:image/png;base64,${req.files["foto_profil"][0].buffer.toString('base64')}`, {
      resource_type: "image",
      folder: "user_profiles"
    });
    foto_profil = result.secure_url;
  } catch (error) {
    return res.status(500).json({ message: "Gagal mengunggah foto profil", error: error.message });
  }

  // Upload foto_ktp ke Cloudinary
  let foto_ktp = null;
  try {
    const result = await cloudinary.uploader.upload(`data:image/png;base64,${req.files["foto_ktp"][0].buffer.toString('base64')}`, {
      resource_type: "image",
      folder: "ktp_pictures"
    });
    foto_ktp = result.secure_url;
  } catch (error) {
    return res.status(500).json({ message: "Gagal mengunggah foto KTP", error: error.message });
  }

  try {
    const user = await User.create({
      email,
      password: hashedPassword,
      confirm_password: hashedPassword,
      nama,
      alamat,
      no_hp,
      foto_profil,
      foto_ktp,
      is_active: false
    });

    res.status(201).json({ message: "User berhasil dibuat!", user });
  } catch (err) {
    res.status(400).json({ message: "Terjadi kesalahan saat mendaftar", error: err.message });
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