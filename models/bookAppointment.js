const { sq } = require("../config/database");
const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");
const Doctors = require("./doctor_reg");
const {User} = require("./users");

const Appointments = sq.define(
  "tbl_appointments",
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
  }
);

Appointments.belongsTo(User, {
  foreignKey: "user_code",
  targetKey: "user_code",
  as: "user",
});

Appointments.sync().then(() => {
  console.log("appointments model synced");
});

const AppointmentReviews = sq.define(
  "tbl_appointment_reviews",
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

AppointmentReviews.belongsTo(User, {
  foreignKey: "user_code",
  targetKey: "user_code",
  as: "user",
});

AppointmentReviews.sync().then(() => {
  console.log("appointments model synced");
});

module.exports = { Appointments, AppointmentReviews };
