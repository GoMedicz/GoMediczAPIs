const { sq } = require('../config/database')
const Sequelize = require('sequelize')
const {DataTypes} = require('sequelize')


const Hospitals = sq.define('hospitals',{
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Facilities: {
        type: DataTypes.JSON, // Store facilities as JSON data
    },
    Departments: {
        type: DataTypes.JSON, // Store departments as JSON data
    },
    About: {
        type: DataTypes.TEXT,
    },
})

Hospitals.sync().then(()=>{
    console.log('hospital model synced')
})



module.exports = Hospitals