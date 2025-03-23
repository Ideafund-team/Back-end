const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");


// Endpoint untuk update data user berdasarkan UUID
router.put("/user/:uuid", auth, async (req, res) => {
    const { uuid } = req.params;
    const { password, nama, alamat, no_hp } = req.body;

    // Trim dan validasi UUID
    const trimmedUuid = uuid.trim();
    if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(trimmedUuid)) {
        return res.status(400).json({ message: "Invalid UUID format." });
    }

    try {
        // Cek apakah user dengan UUID tersebut ada
        const user = await User.findOne({
            where: { id: { [Op.eq]: trimmedUuid } }
        });

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        // Enkripsi password jika ada perubahan
        const hashedPassword = password ? await bcrypt.hash(password.trim(), 10) : user.password;

        // Update data user
        await user.update({
            password: hashedPassword,
            nama: nama?.trim() || user.nama,
            alamat: alamat?.trim() || user.alamat,
            no_hp: no_hp?.trim() || user.no_hp,
        });

        res.status(200).json({ message: "Data user berhasil diperbarui" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat memperbarui data" });
    }
});

module.exports = router;