// const db = require("../config/database")
const { sq } = require('../config/database')
const Sequelize = require('sequelize')
const {DataTypes} = require('sequelize')


const User = sq.define('users',{
    Name:{
        type:DataTypes.STRING,
        allowNull: false,

    },
    Email:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    PhoneNumber:{
        type:DataTypes.STRING,
        primaryKey:true,
        allowNull: false
    },
    Password:{
        type:DataTypes.STRING
    }

})

User.sync({force:true}).then(()=>{
    console.log('User model synced')
})



module.exports = User