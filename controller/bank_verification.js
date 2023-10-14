// const User = require("../models/users");
// const bcrypt = require("bcrypt");
const { Auth } = require("../middlewares/auth");
const { Utils } = require("../middlewares/utils");
// const _ = require("lodash");
const axios = require('axios');

const utils = new Utils();
const auth = new Auth();

const getBanks = async (req, res)=>{
    try {
        const response = await axios.get('https://api.paystack.co/bank', {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_API_KEY}`,
      },
    });



    const banks = response.data.data;

    res.json({ banks });
    } catch (error) {
        res.status(500).json({
            message:"unable to retrieve banks",
            error: utils.getMessage('UNKNOWN_ERROR')

        })
    }

}


const verifyBank = async (req, res)=>{
    try {
        const { accountNumber, bankCode } = req.body;

        const response = await axios.get(
          `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_API_KEY}`,
            },
          }
        );

        const accountName = response.data.data.account_name;
        res.json({ accountName });
    } catch (error) {
        res.status(500).json({
            message:'unable to resolve user bank'
        })
    }
}




















module.exports={getBanks, verifyBank}