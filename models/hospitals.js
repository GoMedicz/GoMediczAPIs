const { sq } = require('../config/database')
const Sequelize = require('sequelize')
const {DataTypes} = require('sequelize')


const Hospitals = sq.define('tbl_hospitals',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    facilities: {
        type: DataTypes.JSON, // Store facilities as JSON data
    },
    departments: {
        type: DataTypes.JSON, // Store departments as JSON data
    },
    about: {
        type: DataTypes.TEXT,
    },
})

Hospitals.sync().then(()=>{
    console.log('hospital model synced')
})



module.exports = Hospitals