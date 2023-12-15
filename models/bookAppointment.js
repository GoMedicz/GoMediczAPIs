// const { sq } = require("../config/database");
// const Sequelize = require("sequelize");
// const { DataTypes } = require("sequelize");
// const Doctors = require("./doctor_reg");
// const {User} = require("./users");

module.exports = (sequelize,DataTypes)=>{

  const Appointment = sequelize.define(
    "Appointment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      appointmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      appointment_code: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true, // Add primaryKey constraint
        unique: true,
      },
      appointmentReason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      appointmentStatus: {
        type: DataTypes.STRING,
      },
      remark: {
        type: DataTypes.STRING,
      },
      appointmentTime: {
        allowNull: false,
        type: DataTypes.TIME,
      },
      labReportPath: {
        type: DataTypes.STRING, // Path to lab report PDF files
      },
      doctor_code: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "tbl_doctors",
          key: "doctor_code",
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
  
      userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "tbl_users",
          key: "email",
        },
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["appointment_code"], // Create a unique index on appointment_code
        },
        {
          fields: ["doctor_code"],
        },
        {
          fields: ["user_code"],
        },
        {
          fields: ["userEmail"],
        },
      ],
    },{
      sequelize,freezeTableName:true,timestamps:true
    }
  );

  Appointment.associate = (models)=>{
    Appointment.belongsTo(models.User, {
      foreignKey: "user_code",
      targetKey: "user_code",
      as: "user",
    });
  }
  

  return Appointment;
}
