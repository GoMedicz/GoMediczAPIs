const { sq } = require('../config/database')
const Sequelize = require('sequelize')
const {DataTypes} = require('sequelize')


const Doctors = sq.define('Doctors',{
    Name:{
        type:DataTypes.STRING,
        allowNull: false,

    },
    Email:{
        type:DataTypes.STRING,
        allowNull: false,
        primaryKey:true,
    },
    PhoneNumber:{
        type:DataTypes.STRING,
        allowNull: false
    },
    Password:{
        type:DataTypes.STRING
    },
    Specialty: {
        type: DataTypes.STRING,
    },
    Hospital: {
        type: DataTypes.STRING
    },
    About: {
        type: DataTypes.TEXT,
    },
    AvailableTimes: {
        type: DataTypes.JSON, // Store available times as JSON data
    },
})

Doctors.sync().then(()=>{
    console.log('Doctors model synced')
})



module.exports = Doctors