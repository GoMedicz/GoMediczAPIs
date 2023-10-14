
const { sq } = require('../config/database');
const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const Doctors = require('./doctor_reg')
const Users = require('./users')



const Appointments = sq.define('tbl_appointments', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    appointmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    appointmentReason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    labReportPath: {
      type: DataTypes.STRING, // Path to lab report PDF files
    },
    doctorCode: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'tbl_doctors',
        key: 'doctor_code',
      },
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'tbl_users',
        key: 'email',
      },
    },
  });


  Appointments.sync().then(() => {
    console.log('appointments model synced');
  });
  
  module.exports = Appointments;
  