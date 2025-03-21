const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  confirm_password: {
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
  ktp: {
    type: DataTypes.STRING,
    allowNull: false
  },
  foto_ktp: {
    type: DataTypes.STRING
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,  // Menambahkan `created_at` dan `updated_at` otomatis
  createdAt: 'created_at', // Sesuai dengan struktur database Anda
  updatedAt: false         // Karena tidak ada kolom `updated_at` di database
});

module.exports = User;
