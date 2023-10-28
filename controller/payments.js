
// const bcrypt = require("bcrypt");
const { Auth } = require("../middlewares/auth");
const { Utils } = require("../middlewares/utils");

const {Withdrawal, DoctorPayment} = require("../models/payments")
const utils = new Utils();
const auth = new Auth();
const Sequelize = require('sequelize')
const { sq } = require('../config/database')




const createWithdrawal = async (req,res)=>{
    try {
        const data = req.body
        if(!data){
           return res.send({
                statusCode:400,
                error:"please provide required credentials"
            })
        }
        const result = await Withdrawal.create({
            doctor_code: data.doctor_code,
            wallet: data.wallet,
            bank_code: data.bank_code,
            bank_name: data.bank_name,
            amount: data.amount,
            account_number: data.account_number,
            account_name: data.account_name,
            date_request: data.date_request || new Date(), // Use provided date_request or current date
            branch_code: data.branch_code,
            status: 'Pending',
            transaction_mode: data.transaction_mode,
            transaction_ref: data.transaction_ref,
          });
          return res.send({
            type: 'success',
            message: 'Transaction Added',
            statusCode: 200,
            data: result,
          });

    } catch (error) {
        return res.send({
            statusCode: 500,
            status: false,
            message: "Unable to create payments",
            error: error.message,
          });
    }
}


const getTransactions = async (req, res)=>{
    try {
        const wallet = req.params.wallet;

        const transactions = await Withdrawal.findAll({
          where: {
            wallet: wallet,
          },
        });

        return res.send({
            statusCode:200,
          type: 'success',
          data: transactions,
        });
    } catch (error) {
        return res.send({
            statusCode: 500,
            status: false,
            message: "Unable to get transactions",
            error: error.message,
          });
    }
}


const getEarnings = async (req, res) => {
  try {
    const data = req.body;
    const wallet = data.wallet;

    // Calculate earnings using Sequelize's query function
    const earningResult = await sq.query(
      data.sql,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    return res.json({
      statusCode: 200,
      type: 'success',
      data: earningResult,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      status: false,
      message: 'Unable to get earnings',
      error: error.message,
    });
  }
};

const addPayment = async(req, res)=>{
  try {
    const data = req.body;


    const result = await DoctorPayment.create({
      doctor_code: data.doctor_code,
      wallet: data.wallet,
      user_code: data.user_code,
      amount: data.amount,
      discount: data.discount,
      method: data.method,
      payer: data.payer,
      appointment_code: data.appointment_code,
      date_paid: new Date(), // Assuming "todayDate" is a Date object
      reference: data.reference,
    });

    return res.send({
      statusCode:200,
      type: 'success',
      message: 'Payment successfully added',
      
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      status: false,
      message: "Unable to add payment",
      error: error.message,
    });
}
  }

  const getDoctorPayments = async (req, res) => {
    try {
      const wallet = req.params.wallet; 
  
      
      const payments = await DoctorPayment.findAll({
        where: { wallet: wallet },
      });
      return res.send({
        statusCode: 200,
        type: 'success',
        message: 'Payments retrieved successfully',
        data: payments,
      });
    } catch (error) {
      return res.send({
        statusCode: 500,
        status: 'error',
        message: 'Unable to retrieve payments',
        error: error.message,
      });
    }
  };



  const getBalance = async (req, res) => {
    try {
      const wallet = req.params.wallet;
  
      // Query to calculate the total payments for the specified wallet
      const paymentQuery = await DoctorPayment.findAll({
        attributes: [
          [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_payments'],
        ],
        where: {
          wallet: wallet,
        },
      });
  
      // Query to calculate the total withdrawals for the specified wallet
      const withdrawalQuery = await Withdrawal.findAll({
        attributes: [
          [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_withdrawals'],
        ],
        where: {
          wallet: wallet,
        },
      });
  
      // Extract the total payments and total withdrawals from the queries
      const totalPayments = paymentQuery[0]?.dataValues.total_payments || 0;
      const totalWithdrawals = withdrawalQuery[0]?.dataValues.total_withdrawals || 0;
  
      // Calculate the balance
      const balance = totalPayments - totalWithdrawals;
  
      return res.status(200).json({
        statusCode: 200,
        type: 'success',
        data: { balance },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        statusCode: 500,
        type: 'error',
        message: 'Unable to get balance',
        error: error.message,
      });
    }
  };
  

module.exports={createWithdrawal, getTransactions, getEarnings, addPayment, getBalance, getDoctorPayments}