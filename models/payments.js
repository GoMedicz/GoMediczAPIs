const { sq } = require('../config/database');
const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');

// Define the DoctorPayment model
const DoctorPayment = sq.define('tbl_doctor_payments', {
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
          type: DataTypes.STRING,
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
          allowNull: true
        }
});

DoctorPayment.sync().then(() => {
    console.log('payments model synced');
  });



// Define the withdrawal model
const Withdrawal = sq.define('tbl_doctor_payments', {
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
       amount: {
          type: DataTypes.STRING,
          allowNull: false
        },
        bank_code: {
          type: DataTypes.STRING,
          allowNull: false
        },
        bank_name: {
          type: DataTypes.STRING,
          allowNull: false
        },
       account_number: {
          type: DataTypes.STRING,
          allowNull: false
        },
        account_name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        date_request: {
          type: DataTypes.DATEONLY,
          allowNull: true
        },
        date_paid: {
          type: DataTypes.DATEONLY,
          allowNull: true
        },
        branch_code: {
          type: DataTypes.STRING,
          allowNull: true
        },

        status: {
          type: DataTypes.STRING,
          allowNull: true
        },
        transaction_mode: {
          type: DataTypes.STRING,
          allowNull: false
        },
        transaction_ref: {
          type: DataTypes.TEXT,
          allowNull: true
        },
  },
);

Withdrawal.sync().then(() => {
    console.log('withdrawal model synced');
  });






module.exports = {DoctorPayment, Withdrawal};
