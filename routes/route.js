const express = require("express");
const authRouter = express.Router();
const {Auth}  = require("../middlewares/auth");
const userAuth = require("../controller/users/reg");
const bank = require("../controller/bank_verification");
const docAuth = require("../controller/doctors/doctors");
const hospital = require("../controller/Hospital/hospital");
const lab = require("../controller/Labs/labs");
const support = require("../controller/support");
const appointment = require("../controller/doctors/appointment");
const {uploadLabReport, upload} = require("../controller/multerConfig")
const transactions = require("../controller/payments");
const {
  loginValidate,
  userOtpValidation,
  userRegV,
  paymentValidation,
  withdrawalValidation,
} = require("../middlewares/userValidator");

const auth = new Auth();

//register new users-send otp
authRouter.post("/api/reg/user/otp", userAuth.Reg);
//verify any field
authRouter.post(
  "/api/verify/any/user/field",
  userAuth.verifyAnyUserField
);
//update any user field
authRouter.post(
  "/api/update/any/user/field",
  userAuth.updateAnyUserField
);
//login user
authRouter.post("/api/login/user", loginValidate, userAuth.login);
//logout user
authRouter.post("/api/log/out", userAuth.logOut);
//verify user otp
authRouter.post(
  "/api/reg/user/verification",
  userRegV,
  userAuth.verifyOtp
);
authRouter.delete(
  "/api/doctor/delete-by-phone/:phoneNumber",
  auth.tokenRequired,
  docAuth.deleteDoctorByPhoneNumber
);
//verify doctor exists with phone
authRouter.post("/api/verify/doc/phoneNumber", docAuth.verifyDoctorWithPhone);
//reg doctors
authRouter.post("/api/doctor/reg", userOtpValidation, docAuth.doctorReg);
//verify doctors otp
// authRouter.post("/api/doc/verification",userOtpValidation, docAuth.verifyDoctorOtp);
//login doctors
authRouter.post("/api/doctor/login", loginValidate, docAuth.docLogin);
//logout doctors
authRouter.post("/api/doctor/logout", auth.tokenRequired, docAuth.docLogOut);
//get doctor's profile
authRouter.get(
  "/api/doctor/profile/:doctorCode",
  auth.tokenRequired,
  docAuth.DoctorProfile
);
//get doctor by phone
authRouter.get(
  "/api/doctor/phone/profile/:phoneNumber",
  auth.tokenRequired,
  docAuth.getDoctorByPhoneNumber
);
//update doctors profile
authRouter.post(
  "/api/update/doctor/profile",
  auth.tokenRequired,
  upload.single("profilePicture"),
  docAuth.updateDoctorProfile
);
//get all doctors profile
authRouter.get(
  "/api/get/all/doctor/profile",
  auth.tokenRequired,
  docAuth.getAllDoctors
);
//rate doctors
authRouter.post("/api/submit/rating", auth.tokenRequired, docAuth.submitRating);
//verify any doctor field
authRouter.post(
  "/api/verify/any/field/doctor",
  docAuth.verifyAnyDoctorField
);
//update any doctor field
authRouter.post(
  "/api/update/any/field/doctor",
  docAuth.updateAnyDoctorField
);
//search doctors
authRouter.get(
  "/api/search/doctors",
  auth.tokenRequired,
  docAuth.searchDoctors
);
//get all banks
authRouter.get("/api/allbanks", bank.getBanks);
//verify banks
authRouter.post("/api/verifybank", bank.verifyBank);
//register hospitals
authRouter.post(
  "/api/reg/Hospital",
  auth.tokenRequired,
  hospital.createHospitalProfile
);
//update hospital
authRouter.post(
  "/api/update/hospital/:hospitalId",
  auth.tokenRequired,
  hospital.updateHospitalProfile
);
//search hospital
authRouter.get(
  "/api/search/hospital",
  auth.tokenRequired,
  hospital.searchHospitals
);
//create labs
authRouter.post("/api/create/lab", auth.tokenRequired, lab.createLabs);
//update labs
authRouter.post("/api/update/lab/:LabId", auth.tokenRequired, lab.updateLabs);
//get labs
authRouter.get("/api/search/lab", auth.tokenRequired, lab.searchLabs);
//submit support message
authRouter.post(
  "/api/support/message",
  auth.tokenRequired,
  support.submitMessage
);
authRouter.post(
  "/api/support/faqs/content",
  auth.tokenRequired,
  support.faqsAndContent
);
authRouter.get(
  "/api/support/messages/all",
  auth.tokenRequired,
  support.getAllMessages
);
authRouter.get(
  "/api/support/faqs/content/all",
  auth.tokenRequired,
  support.getAllFaqsAndContent
);
//post faqs and contents
authRouter.post("/api/faqs", auth.tokenRequired, support.faqsAndContent);
//book appointment
authRouter.post(
  "/api/book/appointment",
  auth.tokenRequired, uploadLabReport.single('labReport'),
  appointment.bookAppointment
);
authRouter.get(
  "/api/appointment/reviews/:doctorCode",
  auth.tokenRequired,
  appointment.getAppointmentReviewsByDoctorCode
);
authRouter.post(
  "/api/submit/appointment/reviews",
  auth.tokenRequired,
  appointment.submitAppointmentReview
);
authRouter.post("/api/doctor/payment/add", auth.tokenRequired, paymentValidation, transactions.addPayment)
authRouter.post("/api/doctor/withdrawal", auth.tokenRequired, withdrawalValidation, transactions.createWithdrawal)
authRouter.post("/api/get/doctor/earnings", auth.tokenRequired, transactions.getEarnings)
authRouter.get("/api/get/doctor/withdrawal/:wallet", auth.tokenRequired, transactions.getTransactions)
authRouter.get("/api/doctor/balance/:wallet", auth.tokenRequired, transactions.getBalance)
authRouter.get("/api/get/doctor/payment/:wallet", auth.tokenRequired, transactions.getDoctorPayments)

module.exports = {
  authRouter,
};
