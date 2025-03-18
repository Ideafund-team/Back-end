const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("db_ideafund", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false, // Hilangkan log query di console
});

sequelize
  .authenticate()
  .then(() => console.log("Database Connected"))
  .catch((err) => console.error("Database Connection Failed:", err));

module.exports = sequelize;
