const {User} = require('../models/users');
const bcrypt = require("bcrypt");
const { Auth } = require("../middlewares/auth");
const { Utils } = require("../middlewares/utils");
const _ = require("lodash");

const utils = new Utils();
const auth = new Auth();
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

const sendOtp = async (phoneNumber, otp) => {
  try {
    // Check if the phoneNumber starts with '+234' or '234' (with or without the plus sign)
    if (!phoneNumber.startsWith('+234') && !phoneNumber.startsWith('234')) {
      // If not, prepend '+234' to the phoneNumber
      phoneNumber = '+234' + phoneNumber;
    }

    const message = await twilioClient.messages.create({
      body: `Your OTP: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to: phoneNumber,
    });

    console.log(message.sid);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

const Reg = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(401).json({
        message: "fields cannot be empty",
        error: utils.getMessage("DATA_ERROR"),
      });
    }
    const existingUser = await User.findOne({ where: { phoneNumber: phoneNumber } });
    if (existingUser) {
      return res.status(409).json({
        message: "User with this phone number already exists",
        error: utils.getMessage("ACCOUNT_EXISTS_ERROR"),
      });
    }
    // Get OTP and PhoneNumber from the frontend
    const { otp } = req.body;
    // Send OTP to the user's phone number
    await sendOtp(phoneNumber, otp);
    console.log("something wrong here");

    // Return success response
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "unable to register user",
      error: utils.getMessage("UNKNOWN_ERROR"),
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const data = req.body;

    // Verify OTP on the frontend
    // ...
    const existingUser = await User.findOne({
      where: { phoneNumber: data.phoneNumber },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this phone number already exists",
        error: utils.getMessage("USER_ALREADY_EXISTS"),
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create the user in the database
    const newUser = await User.create({
      fullName:data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      password: hashedPassword,
    });

    // Generate token
    const token = auth.generateAuthToken(newUser);

    return res.status(200).json({
      message: "Registration successful",
      data: newUser,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "unable to verify user",
      error: utils.getMessage("UNKNOWN_ERROR"),
    });
  }
};

const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      return res.status(400).json({
        status: false,
        message: "invalid credentials",
        error: utils.getMessage(" DATA_VALIDATION_ERROR"),
      });
    }
    //find user
    const user = await User.findOne({ where: { phoneNumber: phoneNumber } });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "user does not exist",
        error: utils.getMessage(" ACCOUNT_EXISTENCE_ERROR"),
      });
    }
    //compare passwords
    const isMatchedPassword = await bcrypt.compare(password, user.password);
    if (!isMatchedPassword) {
      return res.status(400).json({
        status: false,
        message: "invalid password",
        error: utils.getMessage(" PASSWORD_MATCH_ERROR"),
      });
    }
    //if password matches, generate a new token and send in the response
    const token = auth.generateAuthToken({ email: user.email });
    return res.status(200).json({
      status: true,
      message: "login succesfull",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "login failed",
      error: utils.getMessage("ACCOUNT_EXISTENCE_ERROR"),
    });
  }
};

const logOut = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (auth.isTokenInvalid(token)) {
      return res.status(401).json({
        status: false,
        message: "Token is already invalidated",
        error: utils.getMessage("TOKEN_INVALID_ERROR"),
      });
    }

    // Invalidate the token (log out the user)
    auth.invalidateToken(token);

    return res.status(200).json({
      status: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Logout failed",
      error: utils.getMessage("LOGOUT_ERROR"),
    });
  }
};

module.exports = {
  Reg,
  verifyOtp,
  login,
  logOut,
};
