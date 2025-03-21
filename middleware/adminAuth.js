const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Sesuaikan dengan secret key Anda
        req.admin = decoded;  // Menyimpan data admin di request object
        next(); 
    } catch (error) {
        return res.status(403).json({ message: "Invalid token." });
    }
};
