

module.exports = (sequelize,DataTypes)=>{
    
    const Support = sequelize.define('Support',{
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    
    },{
        indexes: [
            {
                fields: ['email'], // Add an index on the 'email' field
            },
            // Add other indexes as needed
        ],
    },{
        sequelize,freezeTableName:true,timestamps:true
    })

    return Support;
}