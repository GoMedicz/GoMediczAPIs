const { sq } = require('../config/database')
const Sequelize = require('sequelize')
const {DataTypes} = require('sequelize')


const Support = sq.define('tbl_support',{
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    }

})

Support.sync().then(()=>{
    console.log('support model synced')
})



module.exports = Support