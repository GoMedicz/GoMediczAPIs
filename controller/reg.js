const User = require("../models/users");

const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const { Auth } = require("../middlewares/auth");
const { Utils } = require("../middlewares/utils");
const OTPx = require("../models/otp");
const _ = require("lodash");

const utils = new Utils();
const auth = new Auth();

const Reg = async (req, res) => {
  try {
    const { Email, PhoneNumber } = req.body;
    if (!Email || !PhoneNumber) {
      return res.status(401).json({
        message: "fields cannot be empty",
        error: utils.getMessage(" DATA_ERROR"),
      });
    }
    const existingUser = await User.findOne({
      where: { Email: req.body.Email },
    });
    if (existingUser) {
      return res.status(400).json({
        message: "This account already exists",
        error: utils.getMessage("ACCOUNT_EXISTS_ERROR"),
      });
    }
    const otp = otpGenerator.generate(6, {
      digit: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);
    client.messages
      .create({
        body: `+${otp}`,
        from: "+15736725667",
        to: `+${PhoneNumber}`,
      })
      .then((message) => console.log(message.sid));

    // console.log(otp);
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    const otpData = await OTPx.create({
      PhoneNumber: req.body.PhoneNumber,
      otp: hashedOtp,
    });
    if (!otpData) {
      return res
        .status(400)
        .json({ status: false, message: utils.getMessage("OTP_ERROR") });
    }
    return res
      .status(200)
      .json({ message: utils.getMessage("QUERY_SUCCESS"), data: otpData });
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
    // const { Name, Email, PhoneNumber } = req.body;

    const otpHolder = await OTPx.findOne({
      where: { PhoneNumber: req.body.PhoneNumber },
    });
    if (!otpHolder) {
      return res.status(200).json({ message: "You use an expired otp" });
    }

    const smsOtp = req.body.otp.replace("+", "").trim();
    const validUser = await bcrypt.compare(smsOtp, otpHolder.otp);

    //check if otp number tallies with the on at db

    if (otpHolder.PhoneNumber === req.body.PhoneNumber && validUser) {
      const { Password, confirmPassword } = req.body;
      if (Password != confirmPassword) {
        return res.status(400).json({
          message: "passwords do not match ",
          error: utils.getMessage(" CONFIRM_PASSWORD_ERROR"),
        });
      }

      const hashedPassword = await bcrypt.hash(Password, 10);

      const newUser = new User(_.pick(req.body, ["PhoneNumber"]));
      newUser.auth = auth;
      //save new user to db after confirmation of otp

      const createUser = await User.create({
        PhoneNumber: req.body.PhoneNumber,
        Email: req.body.Email,
        Name: req.body.Name,
        Password: hashedPassword,
      });
      const token = newUser.auth.generateAuthToken(createUser);
      //delete otp row
      const OtpDelete = await OTPx.destroy({
        where: {
          PhoneNumber: otpHolder.PhoneNumber,
        },
      });
      if (!OtpDelete) {
        res.status(400).json({ message: "problem deleting otp from db" });
      }

      return res.status(200).json({
        message: "succesful",
        data: createUser,
        token: token,
      });
    }

    return res.status(400).json({
      message: "registration failed",
      error: utils.getMessage("UNKNOWN_ERROR"),
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
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      return res.status(400).json({
        status: false,
        message: "invalid credentials",
        error: utils.getMessage(" DATA_VALIDATION_ERROR"),
      });
    }
    //find user
    const user = await User.findOne({ where: { Email: Email } });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "user does not exist",
        error: utils.getMessage(" ACCOUNT_EXISTENCE_ERROR"),
      });
    }
    //compare passwords
    const isMatchedPassword = await bcrypt.compare(Password, user.Password);
    if (!isMatchedPassword) {
      return res.status(400).json({
        status: false,
        message: "invalid password",
        error: utils.getMessage(" PASSWORD_MATCH_ERROR"),
      });
    }
    //if password matches, generate a new token and send in the response
    const token = auth.generateAuthToken(user);
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
