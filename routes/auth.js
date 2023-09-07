const express = require('express')
const app = express()
const authRouter = express.Router()
const {Auth} = require('../middlewares/auth')
const userAuth = require('../controller/reg')
const bank = require('../controller/bank_verification')
const docAuth = require('../controller/doctors')
const {userValidation, loginValidate} = require('../middlewares/userValidator')

const auth = new Auth()



authRouter.post("/reg", userAuth.Reg)
authRouter.post("/login", loginValidate, userAuth.login)
authRouter.post("/logOut", userAuth.logOut)
authRouter.post("/reg/verifyOtp", userAuth.verifyOtp)
authRouter.post("/doctorReg", docAuth.doctorReg)
authRouter.post("/verifyDocOtp", docAuth.verifyDoctorOtp)
authRouter.post("/doctorLogin", docAuth.Doclogin )
authRouter.post("/doctorLogout", docAuth.DoclogOut )
authRouter.get("/getDoctorProfile/:doctorEmail", docAuth.DoctorProfile)
authRouter.put("/updateDoctorProfile",auth.tokenRequired, docAuth.updateDoctorProfile)
authRouter.post("/submitRating",auth.tokenRequired, docAuth.submitRating )
authRouter.get("/searchDoctors", docAuth.searchDoctors);
authRouter.get("/allbanks", bank.getBanks);
authRouter.post("/verifybank", bank.verifyBank)


module.exports = {
    authRouter
}