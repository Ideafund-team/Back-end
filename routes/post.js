const express = require("express");
const authenticate = require("../middleware/auth");
const Post = require("../models/Post");
const User = require("../models/User");
const upload = require("../middleware/upload"); // Asumsi ini middleware untuk upload
const cloudinary = require("../config/cloudinary"); // Asumsi ini konfigurasi Cloudinary
const adminAuth = require("../middleware/adminauth"); 
const auth = require("../middleware/auth");


const router = express.Router();

// Endpoint untuk membuat postingan baru
router.post("/", upload.single("image"), async (req, res) => {
  const { 
      title, 
      summary, 
      description, 
      location, 
      investment_available, 
      investment_amount
  } = req.body;

  // Validasi data yang diperlukan (image tidak wajib)
  if (!title || !summary || !description || !location || !investment_available || !investment_amount) {
      return res.status(400).json({ error: "Kolom belum terisi dengan lengkap." });
  }

  let image = null;
  if (req.file) {
      try {
          const result = await cloudinary.uploader.upload(`data:image/png;base64,${req.file.buffer.toString('base64')}`, {
              resource_type: "image",
              folder: "ide_images"
          });
          image = result.secure_url;
      } catch (error) {
          return res.status(500).json({ message: "Gagal mengunggah gambar", error: error.message });
      }
  }

  try {
      const post = await Post.create({
          title,
          status: 0, // Default value
          summary,
          description,
          image,
          location,
          is_verified: 0, // Default value
          investment_available,
          investment_amount,
          total_investors: [] // Array kosong saat ide pertama kali dibuat
      });

      res.status(201).json(post);
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
});

// Endpoint untuk mendapatkan semua postingan
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({ include: User });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data postingan." });
  }
});


// Route untuk verifikasi postingan
router.put("/", adminAuth, async (req, res) => {
    console.log("Request body:", req.body);

    const { id, is_verified } = req.body;

    try {
        const post = await Post.findByPk(id);
        if (!post) {
            console.log("Post not found");
            return res.status(404).json({ message: "Post not found" });
        }

        await Post.update(
            { is_verified: is_verified },
            { where: { id } }
        );

        const updatedPost = await Post.findByPk(id);

        res.status(200).json({
            message: "Post verified successfully",
            post: updatedPost
        });
    } catch (err) {
        console.error("Error details:", err);
        res.status(500).json({
            error: "Failed to verify post",
            details: err.message
        });
    }
});


module.exports = router;
