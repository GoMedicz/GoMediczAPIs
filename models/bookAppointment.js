
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
    appointment_code:{
      type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true, // Add primaryKey constraint
        unique: true,
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
    user_code:{
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'tbl_users',
        key: 'user_code',
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


  Appointments.sync({force:true}).then(() => {
    console.log('appointments model synced');
  });

  module.exports = Appointments;
