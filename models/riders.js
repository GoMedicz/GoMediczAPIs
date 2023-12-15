

module.exports = (sequelize,DataTypes)=>{
    
    const Rider = sequelize.define('Rider',{
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
    },{
        sequelize,freezeTableName:true,timestamps:true
    });

    return Rider;
}
