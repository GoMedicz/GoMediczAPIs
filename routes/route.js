const express = require("express");
const authRouter = express.Router();
const { Auth } = require("../middlewares/auth");
const userAuth = require("../controller/reg");
const bank = require("../controller/bank_verification");
const docAuth = require("../controller/doctors/doctors");
const hospital = require("../controller/Hospital/hospital");
const lab = require("../controller/Labs/labs");
const support = require("../controller/support");
const appointment = require("../controller/doctors/appointment")
const {
  docLogin,
  docValidation,
  userValidation,
  loginValidate,
  userOtpValidation
} = require("../middlewares/userValidator");

const auth = new Auth();
//register new users
authRouter.post("/reg_user",userValidation, userAuth.Reg);
//login user
authRouter.post("/login_user", loginValidate, userAuth.login);
//logout user
authRouter.post("/log_out", userAuth.logOut);
//verify user otp
authRouter.post("/reg_user/verify_otp",userOtpValidation, userAuth.verifyOtp);
//reg doctors
authRouter.post("/doctor_reg",docValidation, docAuth.doctorReg);
//verify doctors otp
authRouter.post("/verify/doc_otp",userOtpValidation, docAuth.verifyDoctorOtp);
//login doctors
authRouter.post("/doctor/login",   loginValidate, docAuth.Doclogin);
//logout doctors
authRouter.post("/doctor/logout",auth.tokenRequired, docAuth.DoclogOut);
//get doctor's profile
authRouter.get("/get_doctor/profile/:doctorCode",auth.tokenRequired, docAuth.DoctorProfile);
//update doctors profile
authRouter.post(
  "/update_doctor/profile",
  auth.tokenRequired,
  docAuth.updateDoctorProfile
);
//rate doctors
authRouter.post("/submit/rating", auth.tokenRequired, docAuth.submitRating);
//search doctors
authRouter.get("/search/doctors", auth.tokenRequired, docAuth.searchDoctors);
//get all banks
authRouter.get("/allbanks", auth.tokenRequired, bank.getBanks);
//verify banks
authRouter.post("/verifybank", auth.tokenRequired, bank.verifyBank);
//register hospitals
authRouter.post("/reg/Hospital",auth.tokenRequired, hospital.createHospitalProfile);
//update hospital
authRouter.post("/update/hospital/:hospitalId",auth.tokenRequired, hospital.updateHospitalProfile);
//search hospital
authRouter.get("/search/hospital", auth.tokenRequired,hospital.searchHospitals);
//create labs
authRouter.post("/create/lab",auth.tokenRequired, lab.createLabs);
//update labs
authRouter.post("/update/lab/:LabId",auth.tokenRequired, lab.updateLabs);
//get labs
authRouter.get("/search/lab",auth.tokenRequired, lab.searchLabs);
//submit support message
authRouter.post("/support/message",auth.tokenRequired, support.submitMessage);
//post faqs and contents
authRouter.post("/faqs",auth.tokenRequired, support.faqsAndContent);
//book appointment
authRouter.post("/book_appointment",auth.tokenRequired, appointment.bookAppointment)


module.exports = {
  authRouter,
};
