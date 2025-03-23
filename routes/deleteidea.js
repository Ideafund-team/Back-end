const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const adminAuth = require("../middleware/adminauth"); 



//delete idea by id
router.delete("/:id", adminAuth, async (req, res) => {
    const { id } = req.params;  // Ambil ID dari URL

    try {
        const idea = await Post.findOne({ where: { id } });  // Cari ide berdasarkan ID

        if (!idea) {
            return res.status(404).json({ message: "Ide tidak ditemukan" });
        }

        await idea.destroy();  // Hapus ide
        res.status(200).json({ message: "Ide berhasil dihapus" });
    } catch (error) {
        console.error("Error deleting idea:", error);
        res.status(500).json({ message: "Gagal menghapus ide", error: error.message });
    }
});

module.exports = router;