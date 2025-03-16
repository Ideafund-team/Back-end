const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Post = sequelize.define("Post", {
  judul: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  detail:{
    type: DataTypes.TEXT,
    allowNull: false,
  }
});

Post.belongsTo(User);
User.hasMany(Post);

module.exports = Post;
