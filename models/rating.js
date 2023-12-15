



module.exports = (sequelize,DataTypes)=>{
    const Rating = sequelize.define(
        "Rating",
        {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          doctorCode: {
            // Updated to match the column name in Doctors table
            type: DataTypes.STRING,
            allowNull: false,
            references: {
              model: "tbl_doctors", // Use the Doctors model for reference
              key: "doctor_code", // Updated to match the column name in Doctors table
            },
          },
          userEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
              model: "tbl_users",
              key: "email",
            },
          },
          rating: {
            type: DataTypes.DECIMAL(5, 2), // (total digits, decimal places)
          },
      
          totalAppointmentsBooked: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
          },
          totalRating: {
            type: DataTypes.DECIMAL,
            defaultValue: 0,
          },
          reviewComments: {
            type: DataTypes.TEXT,
          },
        },
        {
          indexes: [
            // Index for the 'doctorCode' field for quick lookup by doctor code
            {
              fields: ["doctorCode"],
            },
            // Index for the 'userEmail' field for quick lookup by user email
            {
              fields: ["userEmail"],
            },
            // Composite index for multiple fields (example: 'doctorCode' and 'rating')
            {
              fields: ["doctorCode", "rating"],
            },
            // ... add more indexes as needed ...
          ],
        },{
            sequelize,freezeTableName:true,timestamps:true
        }
      );

      Rating.associate = (models)=>{
        Rating.belongsTo(models.Doctor, { foreignKey: 'doctorCode' });
      }

      return Rating;
}