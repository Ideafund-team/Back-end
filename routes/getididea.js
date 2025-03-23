const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { Op } = require("sequelize");

// Endpoint untuk mendapatkan data ide berdasarkan id_user (UUID)
router.get("/ide/:id_user", async (req, res) => {
    const { id_user } = req.params;

    // Gunakan .trim() untuk menghindari spasi yang tidak disengaja pada ID
    const trimmedId = id_user.trim();

    // Validasi ID sebagai UUID
    if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(trimmedId)) {
        return res.status(400).json({ message: "Format UUID tidak valid" });
    }

    try {
        const ideas = await Post.findAll({
            where: { id_owner: { [Op.eq]: trimmedId } } // Pencarian tepat dengan UUID
        });

        if (!ideas || ideas.length === 0) {
            return res.status(404).json({ message: "Ide tidak ditemukan" });
        }

        res.status(200).json(ideas);
    } catch (error) {
        console.error("Error fetching ideas:", error);
        res.status(500).json({
            error: "Gagal mengambil data ide",
            details: error.message
        });
    }
});


module.exports = router;