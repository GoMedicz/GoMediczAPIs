// models/Ratings.js

const { sq } = require('../config/database');
const { DataTypes } = require('sequelize');

const Ratings = sq.define('ratings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  doctorEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Doctors',
      key: 'Email',
    },
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'Email',
    },
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
});

Ratings.sync().then(() => {
  console.log('Ratings model synced');
});

module.exports = Ratings;
