const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const LibraryTransaction = sequelize.define('LibraryTransaction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  book_uid: { type: DataTypes.STRING, allowNull: false },
  user_uid: { type: DataTypes.STRING, allowNull: false },
  issue_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  due_date: { type: DataTypes.DATE },
  return_date: { type: DataTypes.DATE, allowNull: true },
  fine_amount: { type: DataTypes.FLOAT, defaultValue: 0 },
  status: { type: DataTypes.ENUM('ISSUED', 'RETURNED'), defaultValue: 'ISSUED' }
});

module.exports = LibraryTransaction;