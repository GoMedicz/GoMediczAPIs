const express = require('express')
const authRouter = express.Router()
const {Auth} = require('../middlewares/auth')
const userAuth = require('../controller/reg')
const {userValidation, loginValidate, userOtpValidation} = require('../middlewares/userValidator')

const auth = new Auth()

authRouter.post("/reg", userValidation, userAuth.Reg)
authRouter.post("/login", loginValidate, userAuth.login)
authRouter.post("/logOut", userAuth.logOut)


authRouter.post("/reg/verifyOtp",userOtpValidation, userAuth.verifyOtp)

module.exports = {
    authRouter
}