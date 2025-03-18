const multer = require('multer');

const storage = multer.memoryStorage(); // Cloudinary menggunakan buffer, bukan file fisik

const upload = multer({ storage });

module.exports = upload;
