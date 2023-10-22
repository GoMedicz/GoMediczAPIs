const { sq } = require('../config/database');
const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const Doctors = require('./doctor_reg')

const AvailableTimes = sq.define('tbl_available_times', {
  doctor_code: {
    type: DataTypes.STRING,
  },
  appointment_code: {
    type: DataTypes.STRING,
  },
  available_days: {
    type: DataTypes.JSON,

  },
  available_start_time: {
    type: DataTypes.TIME,
  },
  available_end_time: {
    type: DataTypes.TIME,

  },
  minutesPerSection: {
    type: DataTypes.INTEGER,

  },
  available_months: {
    type: DataTypes.JSON,

  },
});

AvailableTimes.belongsTo(Doctors, {
  foreignKey: 'doctor_code',
});
AvailableTimes.sync().then(() => {
    console.log('available times model synced');
});

module.exports = AvailableTimes;
