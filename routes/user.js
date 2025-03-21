const express = require("express");
const adminAuth = require("../middleware/adminauth");
const User = require("../models/User");

const router = express.Router();

// Route untuk mengaktifkan user
router.put("/", adminAuth, async (req, res) => {
    console.log("Request body:", req.body);

    const { id, is_active } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        await User.update(
            { is_active: is_active },
            { where: { id } }
        );

        const updatedUser = await User.findByPk(id);

        res.status(200).json({
            message: "User status updated successfully",
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

module.exports = router;
