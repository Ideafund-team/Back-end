const express = require("express");
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user"); 

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/idea", postRoutes);
app.use("/verify", postRoutes);
app.use("/active", userRoutes);
app.use("/status", postRoutes); 

sequelize
  .sync({ alter: true }) // Perbarui tabel tanpa menghapus data 
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error("Database error:", err));

app.listen(3000, () => console.log("Server running on port 3000"));
