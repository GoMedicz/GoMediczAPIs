// const { sq } = require('../config/database');
// const Sequelize = require('sequelize');
// const { DataTypes } = require('sequelize');


module.exports = (sequelize,DataTypes)=>{
  
  // Define the DoctorPayment model
  const DoctorPayment = sequelize.define('DoctorPayment', {
      id: {
          type: DataTypes.INTEGER,
          unique: true,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
          },
          doctor_code: {
            type: DataTypes.STRING,
            allowNull: false
          },
  
          wallet: {
            type: DataTypes.STRING,
            allowNull: false
          },
        appointment_code: {
            type: DataTypes.STRING,
            allowNull: false
          },
         user_code: {
            type: DataTypes.STRING,
            allowNull: false
          },
         amount: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          discount: {
            type: DataTypes.STRING,
            allowNull: true
          },
          method: {
            type: DataTypes.STRING,
            allowNull: false
          },
         payer: {
            type: DataTypes.STRING,
            allowNull: true
          },
          date_paid: {
            type: DataTypes.DATE,
            allowNull: true
          },
          reference: {
            type: DataTypes.STRING,
            allowNull: true
          },
          payment_data: {
            type: DataTypes.STRING,
            defaultValue: "[]",
          }
  },{
    indexes: [
        // Index for the 'doctor_code' field for quick lookup by doctor code
        {
            fields: ['doctor_code'],
        },
        // Index for the 'wallet' field for quick lookup by wallet
        {
            fields: ['wallet'],
        },
        // Index for the 'appointment_code' field for quick lookup by appointment code
        {
            fields: ['appointment_code'],
        },
        // Index for the 'user_code' field for quick lookup by user code
        {
            fields: ['user_code'],
        },
        // Index for the 'method' field for quick lookup by payment method
        {
            fields: ['method'],
        },
        // Index for the 'date_paid' field for quick lookup by payment date
        {
            fields: ['date_paid'],
        },
        // Index for the 'reference' field for quick lookup by payment reference
        {
            fields: ['reference'],
        },
        // ... add more indexes as needed ...
    ],
  },{
    sequelize,freezeTableName:true,timestamps:true
  });

  return DoctorPayment;
}
