const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    investment_amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    summary: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING
    },
    location: {
        type: DataTypes.STRING
    },
    investment_available: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_investors: {
        type: DataTypes.JSON,
        defaultValue: []
    }
});

module.exports = Post;
