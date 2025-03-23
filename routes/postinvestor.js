const express = require("express");
const Investor = require("../models/Investor");
const auth = require("../middleware/auth");
const { Op } = require("sequelize");


const router = express.Router();
// Endpoint untuk menambah data investor
router.post("/post", auth,async (req, res) => {
    const { id_owner, id_investor, id_ide, nama_investor, investasi, note } = req.body;

    // Validasi input
    if (!id_owner || !id_investor || !id_ide || !nama_investor || !investasi) {
        return res.status(400).json({ message: "Semua data wajib diisi kecuali note" });
    }

    try {
        const newInvestor = await Investor.create({
            id_owner: id_owner.trim(),
            id_investor: id_investor.trim(),
            id_ide: parseInt(id_ide), // Konversi ke integer jika id_ide bertipe integer
            nama_investor: nama_investor.trim(),
            investasi: parseInt(investasi), // Konversi ke integer jika investasi bertipe integer
            note: note ? note.trim() : null,
            status: "pending" // Status default
        });

        res.status(201).json({
            message: "Data investor berhasil ditambahkan",
            data: newInvestor
        });
    } catch (error) {
        console.error("Error creating investor:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat menambahkan data investor" });
    }
});


// Endpoint untuk mendapatkan data investor berdasarkan id_owner
router.get("/:id_owner", async (req, res) => {
    const { id_owner } = req.params;

    // Trim ID untuk mencegah spasi tidak disengaja
    const trimmedId = id_owner.trim();

    // Validasi format UUID untuk id_owner
    if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(trimmedId)) {
        return res.status(400).json({ message: "Format UUID tidak valid" });
    }

    try {
        const investors = await Investor.findAll({
            where: {
                id_owner: { [Op.eq]: trimmedId }
            }
        });

        if (!investors || investors.length === 0) {
            return res.status(404).json({ message: "Investor tidak ditemukan" });
        }

        res.status(200).json(investors);
    } catch (error) {
        console.error("Error fetching investor:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data investor" });
    }
});


// Endpoint untuk mendapatkan semua data investor berdasarkan id_investor
router.get("/allinvestor/:id_investor", async (req, res) => {
    const { id_investor } = req.params;

    // Trim ID untuk menghindari spasi tidak disengaja
    const trimmedId = id_investor.trim();

    try {
        const investors = await Investor.findAll({
            where: {
                id_investor: trimmedId
            }
        });

        if (!investors || investors.length === 0) {
            return res.status(404).json({ message: "Investor tidak ditemukan" });
        }

        res.status(200).json(investors);
    } catch (error) {
        console.error("Error fetching investors:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data investor" });
    }
});


// Endpoint untuk mendapatkan semua data investor berdasarkan id_ide
router.get("/allinvestoride/:id_ide", async (req, res) => {
    const { id_ide } = req.params;

    // Validasi id_ide untuk memastikan hanya angka yang diterima
    if (!/^\d+$/.test(id_ide.trim())) {
        return res.status(400).json({ message: "ID Ide harus berupa angka" });
    }

    try {
        const investors = await Investor.findAll({
            where: {
                id_ide: id_ide.trim() // Trim untuk mencegah spasi yang tidak disengaja
            }
        });

        if (!investors || investors.length === 0) {
            return res.status(404).json({ message: "Investor tidak ditemukan untuk ID Ide ini" });
        }

        res.status(200).json(investors);
    } catch (error) {
        console.error("Error fetching investors:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data investor" });
    }
});


// Endpoint untuk update status investor berdasarkan id
router.put("/updatestatusinvestor/:id", auth, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validasi ID agar hanya menerima angka
    if (!/^\d+$/.test(id.trim())) {
        return res.status(400).json({ message: "ID harus berupa angka" });
    }

    try {
        const investor = await Investor.findByPk(id);

        if (!investor) {
            return res.status(404).json({ message: "Investor tidak ditemukan" });
        }

        // Update status investor
        await Investor.update(
            { status: status.trim() }, // Menghapus validasi status
            { where: { id: id } }
        );

        res.status(200).json({ message: "Status berhasil diperbarui" });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat memperbarui status" });
    }
});


module.exports = router;