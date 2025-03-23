const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Investor = sequelize.define("Investor", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_owner: {
        type: DataTypes.CHAR(36),
        allowNull: false
    },
    id_investor: {
        type: DataTypes.CHAR(36),
        allowNull: false
    },
    id_ide: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nama_investor: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    investasi: {
        type: DataTypes.INTEGER(15),
        allowNull: false
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: "investor",
    timestamps: false // Karena tidak ada kolom created_at atau updated_at
});

module.exports = Investor;
