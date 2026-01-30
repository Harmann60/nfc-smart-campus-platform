const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // or wherever your db config is

const Book = sequelize.define('Book', {
  book_uid: { type: DataTypes.STRING, primaryKey: true, unique: true },
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING },
  is_available: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Book;