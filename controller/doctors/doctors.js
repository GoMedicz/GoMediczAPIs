const Doctors = require("../../models/doctor_reg");
const bcrypt = require("bcrypt");
const { Auth } = require("../../middlewares/auth");
const { Utils } = require("../../middlewares/utils");
const { Ratings } = require("../../models/users");
const AvailableTimes = require("../../models/availableTime");
const _ = require("lodash");
const moment = require("moment");
const upload = require("../multerConfig");
const { Op } = require("sequelize");

const utils = new Utils();
const auth = new Auth();
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

const generateDoctorCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  let firstCharacterIsNumber = true;

  while (firstCharacterIsNumber) {
    code = ""; // Reset the code
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    // Check if the first character is not a number
    firstCharacterIsNumber = /^\d/.test(code);
  }

  return code;
};

const verifyDoctorWithPhone = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Check if a doctor with the provided phoneNumber exists
    const existingDoctor = await Doctors.findOne({
      where: { phoneNumber: phoneNumber },
    });

    if (existingDoctor) {
      const response = {
        statusCode: 200,
        status: true,
        message: "Doctor with this phone number exists",
        doctor: existingDoctor,
      };
      return res.send(response);
    } else {
      const response = {
        statusCode: 404,
        status: false,
        message: "Request failed",
      };
      return res.send(response);
    }
  } catch (error) {
    console.log(error);
    const response = {
      statusCode: 500,
      status: false,
      message: "Unable to check doctor existence",
      error: "UNKNOWN_ERROR",
    };
    return res.send(response);
  }
};

const doctorReg = async (req, res) => {
  try {
    const data = req.body; // Store the entire req.body object in 'data'

    // Check if a user with the same phoneNumber already exists
    const existingUser = await Doctors.findOne({
      where: { phoneNumber: data.phoneNumber },
    });

    if (existingUser) {
      const response = {
        statusCode: 409,
        status: false,
        message: "User with this phone number already exists",
        error: utils.getMessage("USER_ALREADY_EXISTS"),
      };
      return res.send(response);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const doctorCode = generateDoctorCode();
    const newDoctor = await Doctors.create({
      doctor_code: doctorCode,
      phoneNumber: data.phoneNumber,
      email: data.email,
      fullName: data.fullName,
      password: hashedPassword,
      wallet: data.wallet,
    });

    // Generate token
    const token = auth.generateAuthToken(newDoctor);

    const response = {
      statusCode: 200,
      status: true,
      message: "Registration successful",
      data: newDoctor,
      wallet: newDoctor.wallet,
      token: token,
    };
    return res.send(response);
  } catch (error) {
    console.error("Error in verifying user:", error);
    const response = {
      statusCode: 500,
      status: false,
      message: "Unable to verify user",
      error: error.message, // Include the error message in the response
    };
    return res.send(response);
  }
};

const docLogin = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      const response = {
        statusCode: 400,
        status: false,
        message: "Invalid credentials",
        error: utils.getMessage("DATA_VALIDATION_ERROR"),
      };
      return res.send(response);
    }
    // Find user
    const doctors = await Doctors.findOne({
      where: { phoneNumber: phoneNumber },
    });
    if (!doctors) {
      const response = {
        statusCode: 400,
        status: false,
        message: "Doctor does not exist",
        error: utils.getMessage("ACCOUNT_EXISTENCE_ERROR"),
      };
      return res.send(response);
    }
    // Compare passwords
    const isMatchedPassword = await bcrypt.compare(password, doctors.password);
    if (!isMatchedPassword) {
      const response = {
        statusCode: 400,
        status: false,
        message: "Invalid password",
        error: utils.getMessage("PASSWORD_MATCH_ERROR"),
      };
      return res.send(response);
    }
    // If the password matches, generate a new token and send it in the response
    const token = auth.generateAuthToken(doctors);
    const response = {
      statusCode: 200,
      status: true,
      message: "Login successful",
      token: token,
      doctor_code: doctors.doctor_code,
      wallet: doctors.wallet,
    };
    return res.send(response);
  } catch (error) {
    console.log(error);
    const response = {
      statusCode: 500,
      status: false,
      message: "Login failed",
      error: utils.getMessage("ACCOUNT_EXISTENCE_ERROR"),
    };
    return res.send(response);
  }
};

// The rest of your code remains the same with the updated response structure.

module.exports = {
  doctorReg,
  docLogin,
  docLogOut,
  updateDoctorProfile,
  searchDoctors,
  DoctorProfile,
  submitRating,
  getDoctorByPhoneNumber,
  verifyDoctorWithPhone,
  verifyAnyDoctorField,
  updateAnyDoctorField,
};
