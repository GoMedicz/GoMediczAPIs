const { sq } = require('../config/database')
const Sequelize = require('sequelize')
const {DataTypes} = require('sequelize')


const OTPx = sq.define('otpx',{
    otp:{
        type:DataTypes.STRING,
        required:true
    },
    PhoneNumber:{
        type:DataTypes.STRING
    },
    expiration_time:{
        type:DataTypes.DATE,
        default:Sequelize.literal('CURRENT_TIMESTAMP + INTERVAL 300 SECOND')
    } ,
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
    }

},{timestamps:true},
// {
//     tableName: 'OTP'
// }
)

OTPx.sync({force:true}).then(()=>{
    console.log('otpx model synced')
})

module.exports = OTPx