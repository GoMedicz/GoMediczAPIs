

module.exports = (sequelize,DataTypes)=>{
    
const Hospital = sequelize.define('Hospital',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    hospital_code: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true, // Add primaryKey constraint
        unique: true,
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

},{
    // This is according to the doc, freezing the tablename is to avoid plural renaming 
    sequelize,freezeTableName:true,timestamps:true
});


return Hospital;
}
