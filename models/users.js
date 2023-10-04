// const db = require("../config/database")
const { sq } = require('../config/database')
const Sequelize = require('sequelize')
const {DataTypes} = require('sequelize')
const Doctors = require("./doctor_reg")


const User = sq.define('tbl_users',{
    name:{
        type:DataTypes.STRING,
        allowNull: false,

    },
    email:{
        type:DataTypes.STRING,
        allowNull: false,
        primaryKey:true,
    },
    phoneNumber:{
        type:DataTypes.STRING,
        allowNull: false
    },
    password:{
        type:DataTypes.STRING
    },
    homeAddress: {
        type: DataTypes.STRING,
    },
    workAddress: {
        type: DataTypes.STRING,
    },
    otherAddress: {
        type: DataTypes.STRING,
    },

}, {
    indexes: [
      // Index for the 'email' field for quick lookup by email
      {
        unique: true,
        fields: ['email']
      },
      // Index for the 'phoneNumber' field for quick lookup by phone number
      {
        unique: true,
        fields: ['phoneNumber']
      },
      // Index for the 'name' field for partial search by name
      {
        fields: ['name']
      },
      // Composite index for multiple fields (example: 'homeAddress' and 'workAddress')
      {
        fields: ['homeAddress', 'workAddress']
      }
      // ... add more indexes as needed ...
    ]
  });


User.sync().then(()=>{
    console.log('User model synced')
})






const Ratings = sq.define('tbl_ratings', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    doctorCode: { // Updated to match the column name in Doctors table
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tbl_doctors', // Use the Doctors model for reference
        key: 'doctor_code', // Updated to match the column name in Doctors table
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
    rating: {
        type: DataTypes.DECIMAL(5, 2), // (total digits, decimal places)
      },

    totalAppointmentsBooked: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalRating: {
      type:  DataTypes.DECIMAL,
      defaultValue: 0,
    },
    reviewComments: {
      type: DataTypes.TEXT,
    },
  },{
    indexes: [
      // Index for the 'doctorCode' field for quick lookup by doctor code
      {
        fields: ['doctorCode']
      },
      // Index for the 'userEmail' field for quick lookup by user email
      {
        fields: ['userEmail']
      },
      // Composite index for multiple fields (example: 'doctorCode' and 'rating')
      {
        fields: ['doctorCode', 'rating']
      }
      // ... add more indexes as needed ...
    ]
  });

  Ratings.sync().then(() => {
    console.log('Ratings model synced');
  });

  module.exports = {
    User,
    Ratings

  }
