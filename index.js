const express = require("express");
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

sequelize
  .sync()
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error("Database error:", err));

app.listen(3000, () => console.log("Server running on port 3000"));
