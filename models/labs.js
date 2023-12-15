// const { sq } = require('../config/database')
// const Sequelize = require('sequelize')
// const {DataTypes} = require('sequelize')



module.exports = (sequelize,DataTypes)=>{
    
    const Lab = sequelize.define('Lab',{
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
        lab_code: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true, // Add primaryKey constraint
            unique: true,     // Add unique constraint
          },
        about: {
            type: DataTypes.TEXT,
        },
    },{
        sequelize,freezeTableName:true,timestamps:true
    })

    return Lab;

}
