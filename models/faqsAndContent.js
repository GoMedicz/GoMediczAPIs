// const { sq } = require('../config/database')
// const Sequelize = require('sequelize')
// const {DataTypes} = require('sequelize')



module.exports = (sequelize,DataTypes)=>{    
    
    const Faq = sequelize.define('Faq',{
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
    
    },{
        indexes: [
            {
                fields: ['title'], // Add an index on the 'title' field
            },
            {
                fields: ['owner'], // Add an index on the 'owner' field
            },
            // Add other indexes as needed
        ],
    },{
        sequelize,freezeTableName:true,timestamps:true
    });

    return Faq;
}