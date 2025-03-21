const jwt = require("jsonwebtoken");

const userAuth = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Akses ditolak!" });
    }

    try {
        const tokenParts = token.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return res.status(400).json({ message: "Format token salah!" });
        }

        const verified = jwt.verify(tokenParts[1], "secretkey");

        if (!verified.role || verified.role !== "user") {
            return res.status(403).json({ message: "Akses hanya untuk pengguna." });
        }

        req.user = verified;
        next();
    } catch (err) {
        console.error("JWT Error:", err.message);
        res.status(400).json({ message: "Token tidak valid!" });
    }
};

module.exports = userAuth;
