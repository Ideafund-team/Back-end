const express = require("express");
const adminAuth = require("../middleware/adminauth");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { validate: isUuid } = require("uuid"); // Import metode validasi UUID
const { Sequelize } = require('sequelize'); // Impor Sequelize

const router = express.Router();

// Route untuk mengaktifkan user
router.put("/", adminAuth, async (req, res) => {
    console.log("Request body:", req.body);

    const { id, is_active } = req.body;

    // Gunakan .trim() untuk menghindari spasi yang tidak disengaja pada ID
    const trimmedId = id.trim();

    // Validasi ID sebagai UUID
    if (!isUuid(trimmedId)) {
        return res.status(400).json({ message: "Invalid ID format. ID harus berupa UUID." });
    }

    try {
        const user = await User.findOne({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('id')), 
                trimmedId.toLowerCase()
            )
        });

        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        await User.update(
            { is_active: is_active },
            {
                where: Sequelize.where(
                    Sequelize.fn('LOWER', Sequelize.col('id')),
                    trimmedId.toLowerCase()
                )
            }
        );

        const updatedUser = await User.findOne({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('id')), 
                trimmedId.toLowerCase()
            )
        });

        res.status(200).json({
            message: "User activated successfully",
            user: updatedUser
        });
    } catch (err) {
        console.error("Error details:", err);
        res.status(500).json({
            error: "Failed to update user status",
            details: err.message
        });
    }
});



// Endpoint untuk pengguna mengubah status ide menjadi "1" (available)
router.put("/", auth, async (req, res) => {
    console.log("Request body:", req.body);

    const { id } = req.body;

    try {
        const post = await Post.findByPk(id);
        if (!post) {
            console.log("Post not found");
            return res.status(404).json({ message: "Post not found" });
        }

        // Validasi apakah pengguna adalah pemilik postingan
        if (post.userId !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to edit this post" });
        }

        await Post.update(
            { status: 1 }, // Ubah status menjadi 1 (available)
            { where: { id } }
        );

        const updatedPost = await Post.findByPk(id);

        res.status(200).json({
            message: "Post status updated successfully",
            post: updatedPost
        });
    } catch (err) {
        console.error("Error details:", err);
        res.status(500).json({
            error: "Failed to update post status",
            details: err.message
        });
    }
});


// Endpoint untuk mendapatkan data pengguna berdasarkan ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id); // Cari user berdasarkan ID

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
            error: "Failed to retrieve user",
            details: error.message
        });
    }
});

// Endpoint untuk mendapatkan semua pengguna
router.get("/", async (req, res) => {
    try {
        const users = await User.findAll(); // Ambil semua data user

        if (!users.length) {
            return res.status(404).json({ message: "No users found" });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            error: "Failed to retrieve users",
            details: error.message
        });
    }
});

// Endpoint untuk mendapatkan semua pengguna berdasarkan status verifikasi
router.post("/", async (req, res) => {
    let { is_active } = req.body; // Ambil status dari body

    // Konversi string ke integer jika perlu
    if (typeof is_active === "string") {
        is_active = parseInt(is_active, 10);
    }

    // Validasi parameter
    if (is_active !== 0 && is_active !== 1) {
        return res.status(400).json({
            message: "Invalid is_active value. Use 0 (not verified) or 1 (verified)."
        });
    }

    try {
        // Cari pengguna berdasarkan status verifikasi
        const users = await User.findAll({
            where: { is_active: is_active }
        });

        if (!users.length) {
            return res.status(404).json({ message: "No users found with the specified status." });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            error: "Failed to retrieve users",
            details: error.message
        });
    }
});




module.exports = router;
