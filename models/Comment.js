const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Comment = sequelize.define("Comment", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,  // Bisa null jika komentar utama
    },
}, {
    timestamps: true,
});

// Relasi ke dirinya sendiri
Comment.hasMany(Comment, { as: "replies", foreignKey: "parent_id" });
Comment.belongsTo(Comment, { as: "parent", foreignKey: "parent_id" });

module.exports = Comment;
