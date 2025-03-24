const express = require("express");
const cors = require("cors"); // Import CORS
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user"); 
const deleteIdeaRoutes = require("./routes/deleteidea");
const updateuserRoutes = require("./routes/updateuser"); 
const postInvestorRoutes = require("./routes/postinvestor");
const getidfromowner = require("./routes/getididea");
const updateideaRoutes = require("./routes/updateidea");
const app = express();

const port = process.env.PORT || 8080;

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
app.use("/ideabyid", postRoutes);
app.use("/idea", postRoutes);
app.use("/user", postRoutes);
app.use("/deleteidea", deleteIdeaRoutes); 
app.use("/update", updateuserRoutes);
app.use("/investor", postInvestorRoutes);
app.use("/getinvestorbyowner", postInvestorRoutes);
app.use("/getallinvestor", postInvestorRoutes);
app.use("/getinvestoride", postInvestorRoutes);
app.use("/updatestatus", postInvestorRoutes);
app.use("/getidowner", getidfromowner);
app.use("/updateide", updateideaRoutes);

sequelize
  .sync({ alter: true }) // Perbarui tabel tanpa menghapus data 
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error("Database error:", err));

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
