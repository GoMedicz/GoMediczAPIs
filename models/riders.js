const { sq } = require('../config/database')
const Sequelize = require('sequelize')
const {DataTypes} = require('sequelize')


const Riders = sq.define('tbl_riders',{
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rider_code: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true, // Add primaryKey constraint
        unique: true,
    },
    wallet: {
        type: DataTypes.STRING,
        unique: true
    },


})

Riders.sync().then(()=>{
    console.log('riders model synced')
})



module.exports = Riders