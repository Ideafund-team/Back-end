const express = require("express");
const cors = require("cors"); // Import CORS
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user"); 

const app = express();

// Gunakan middleware CORS
app.use(cors({
    origin: 'http://localhost:3000', // Sesuaikan dengan URL frontend Anda
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Definisi route
app.use("/auth", authRoutes);
app.use("/idea", postRoutes);
app.use("/verify", postRoutes);
app.use("/active", userRoutes);
app.use("/status", userRoutes);
app.use("/user", userRoutes);
app.use("/alluser", userRoutes);
app.use("/userbyactive", userRoutes);

sequelize
  .sync({ alter: true }) // Perbarui tabel tanpa menghapus data 
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error("Database error:", err));

app.listen(3000, () => console.log("Server running on port 3000"));
