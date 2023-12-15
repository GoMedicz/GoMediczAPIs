



module.exports = (sequelize,DataTypes)=>{
    const AppointmentReview = sequelize.define(
        "AppointmentReview",
        {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          appointment_code: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
              model: "tbl_appointments",
              key: "appointment_code",
            },
          },
          user_code: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
              model: "tbl_users",
              key: "user_code",
            },
          },
          doctor_code: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
              model: "tbl_doctors",
              key: "doctor_code",
            },
          },
          rating: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
          },
          reviewComments: {
            type: DataTypes.TEXT,
          },
          date_reviewed: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          totalRating: {
            type: DataTypes.DECIMAL,
            defaultValue: 0,
          },
          totalAppointmentsBooked: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
          },
          // Include other fields you want to add to the model
        },
        {
          indexes: [
            {
              fields: ["appointment_code"],
            },
            {
              fields: ["user_code"],
            },
            {
              fields: ["doctor_code"],
            },
          ],
        }
      );
      
      AppointmentReview.associate = (models)=>{
          AppointmentReview.belongsTo(models.User, {
            foreignKey: "user_code",
            targetKey: "user_code",
            as: "user",
          });
      }

      return AppointmentReview;
}