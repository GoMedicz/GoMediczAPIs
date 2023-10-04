const { sq } = require('../config/database')
const Sequelize = require('sequelize')
const {DataTypes} = require('sequelize')


const Labs = sq.define('tbl_labs',{
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

Labs.sync().then(()=>{
    console.log('lab model synced')
})



module.exports = Labs