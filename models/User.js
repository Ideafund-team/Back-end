const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid"); // Library untuk generate UUID
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.STRING,  // Ubah tipe data ke UUID
    defaultValue: DataTypes.UUIDV4, // Auto-generate UUID
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  no_hp: {
    type: DataTypes.STRING,
    allowNull: false
  },
  foto_profil: {
    type: DataTypes.STRING
  },
  foto_ktp: {
    type: DataTypes.STRING
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: "users",
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});



module.exports = User;
