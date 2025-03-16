const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization");

  console.log("Received Token:", token); // Tambahkan ini untuk debugging

  if (!token) return res.status(401).json({ message: "Akses ditolak!" });

  try {
    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(400).json({ message: "Format token salah!" });
    }

    const verified = jwt.verify(tokenParts[1], "secretkey");
    req.user = verified;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message); // Tambahkan log error
    res.status(400).json({ message: "Token tidak valid!" });
  }
};

module.exports = authenticate;
