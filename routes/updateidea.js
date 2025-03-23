const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const cloudinary = require("../config/cloudinary"); // Asumsi ini konfigurasi Cloudinary
const upload = require("../middleware/upload"); // Import upload middleware
const { Op } = require("sequelize");

const router = express.Router();

// Endpoint untuk update data ide berdasarkan ID
router.put("/ide/:id", auth, upload.single("image"), async (req, res) => {
    const { id } = req.params;
    const { title, investment_amount, summary, description, location, kategori } = req.body;

    if (!/^\d+$/.test(id.trim())) {
        return res.status(400).json({ message: "ID harus berupa angka" });
    }

    try {
        const existingPost = await Post.findByPk(id);
        if (!existingPost) {
            return res.status(404).json({ message: "Ide tidak ditemukan" });
        }

        let image = existingPost.image;
        if (req.file) {
            try {
                const result = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: "image", folder: "ide_images" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    stream.end(req.file.buffer);
                });

                image = result.secure_url;
            } catch (error) {
                console.error("Gagal mengunggah gambar:", error);
                return res.status(500).json({
                    message: "Gagal mengunggah gambar",
                    error: error.message
                });
            }
        }

        await existingPost.update({
            title: title?.trim() || existingPost.title,
            investment_amount: investment_amount !== undefined && investment_amount !== ""
                    ? Number(investment_amount) // Gunakan Number() untuk konversi yang lebih andal
                    : existingPost.investment_amount,

            summary: summary?.trim() || existingPost.summary,
            description: description?.trim() || existingPost.description,
            image,
            location: location?.trim() || existingPost.location,
            kategori: kategori || existingPost.kategori,
        });

        console.log("Data yang diterima:", req.body);

        
        

        res.status(200).json({ message: "Data ide berhasil diperbarui" });
    } catch (error) {
        console.error("Error updating ide:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat memperbarui data ide", error: error.message });
    }
});


module.exports = router;
