const { sq } = require('../config/database')
const Sequelize = require('sequelize')
const {DataTypes} = require('sequelize')


const Faqs = sq.define('tbl_faqs',{
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    owner: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type:DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN, // Store facilities as JSON data
    },

})

Faqs.sync().then(()=>{
    console.log('faqs model synced')
})
