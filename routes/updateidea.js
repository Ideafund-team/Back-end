const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const cloudinary = require("../config/cloudinary"); // Asumsi ini konfigurasi Cloudinary
const { Op } = require("sequelize");

const router = express.Router();

// Endpoint untuk update data ide berdasarkan ID
router.put("/ide/:id", auth, async (req, res) => {
    const { id } = req.params;
    const { title, investment_amount, summary, description, location, investment_available } = req.body;

    // Validasi ID agar hanya berupa angka
    if (!/^\d+$/.test(id.trim())) {
        return res.status(400).json({ message: "ID harus berupa angka" });
    }

    try {
        // Cek apakah ide dengan ID tersebut ada
        const existingPost = await Post.findByPk(id);
        if (!existingPost) {
            return res.status(404).json({ message: "Ide tidak ditemukan" });
        }

        // Upload gambar jika ada file yang diunggah
        let image = existingPost.image; // Gambar lama tetap digunakan jika tidak ada gambar baru
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(
                    `data:image/png;base64,${req.file.buffer.toString('base64')}`, 
                    {
                        resource_type: "image",
                        folder: "ide_images"
                    }
                );
                image = result.secure_url;
            } catch (error) {
                return res.status(500).json({ 
                    message: "Gagal mengunggah gambar", 
                    error: error.message 
                });
            }
        }

        // Update data ide
        await Post.update({
            title: title?.trim() || existingPost.title,
            investment_amount: investment_amount || existingPost.investment_amount,
            summary: summary?.trim() || existingPost.summary,
            description: description?.trim() || existingPost.description,
            image, // Gambar yang baru saja diunggah atau gambar lama
            location: location?.trim() || existingPost.location,
            investment_available: investment_available || existingPost.investment_available,
        }, {
            where: { id: id }
        });

        res.status(200).json({ message: "Data ide berhasil diperbarui" });
    } catch (error) {
        console.error("Error updating ide:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat memperbarui data ide" });
    }
});

module.exports = router;