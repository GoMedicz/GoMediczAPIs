const { User } = require("../../models/users");
const bcrypt = require("bcrypt");
const { Auth } = require("../../middlewares/auth");
const { Utils } = require("../../middlewares/utils");
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
    if (!phoneNumber.startsWith("+234") && !phoneNumber.startsWith("234")) {
      // If not, prepend '+234' to the phoneNumber
      phoneNumber = "+234" + phoneNumber;
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

const generateUserCode = () => {
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

const Reg = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.send({
        statusCode:401,
        message: "Fields cannot be empty",
        error: utils.getMessage("DATA_ERROR"),
      });
    }
    const existingUser = await User.findOne({
      where: { phoneNumber: phoneNumber },
    });
    if (existingUser) {
      return res.send({
        statusCode:400,
        message: "User with this phone number already exists",
        error: utils.getMessage("ACCOUNT_EXISTS_ERROR"),
      });
    }
    // Get OTP and PhoneNumber from the frontend
    const { otp } = req.body;
    // Send OTP to the user's phone number
    await sendOtp(phoneNumber, otp);

    // Update the response message to include the OTP
    const responseMessage = `DO NOT DISCLOSE: Use ${otp} as your one-time password to continue your Gomedicz registration`;

    // Return the modified success response
    return res.send({ statusCode:200, message: responseMessage, statusCode:200 });
  } catch (error) {
    console.log(error);
    return res.send({
      statusCode:500,
      status: false,
      message: "Unable to register user",
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
      return res.send({
        statusCode:409,
        message: "User with this phone number already exists",
        error: "USER_ALREADY_EXISTS", // Provide a specific error code
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user_code = generateUserCode();

    // Create the user in the database
    const newUser = await User.create({
      user_code: user_code,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      password: hashedPassword,
      wallet: data.wallet,
    });

    // Generate token
    const token = auth.generateAuthToken(newUser);

    return res.send({
      statusCode:200,
      status: true, // Set status to true for success
      message: "Registration successful",
      data: newUser,
      token: token,
      user_code: user_code,
      wallet: newUser.wallet, // Double-check the wallet variable source
    });

  } catch (error) {
    console.error("Error in user creation:", error);
    return res.send({
      statusCode:500,
      status: false,
      message: "Registration failed",
      error: "UNKNOWN_ERROR"
    });
  }
};


const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      return res.send({
        statusCode:400,
        status: false,
        message: "invalid credentials",
        error: utils.getMessage(" DATA_VALIDATION_ERROR"),
      });
    }
    //find user
    const user = await User.findOne({ where: { phoneNumber: phoneNumber } });
    if (!user) {
      return res.send({
        statusCode:400,
        status: false,
        message: "user does not exist",
        error: utils.getMessage(" ACCOUNT_EXISTENCE_ERROR"),
      });
    }
    //compare passwords
    const isMatchedPassword = await bcrypt.compare(password, user.password);
    if (!isMatchedPassword) {
      return res.send({
        statusCode:400,
        status: false,
        message: "invalid password",
        error: utils.getMessage(" PASSWORD_MATCH_ERROR"),
      });
    }
    //if password matches, generate a new token and send in the response
    const token = auth.generateAuthToken({ email: user.email });
    return res.send({
      statusCode:200,
      status: true,
      message: "login successful",
      token: token,
      user_code: user_code,
      wallet: wallet,
    });
  } catch (error) {
    return res.send({
      statusCode:500,
      status: false,
      message: "login failed",
      error: utils.getMessage("ACCOUNT_EXISTENCE_ERROR"),
    });
  }
};

const verifyAnyUserField = async (req, res) => {
  try {
    const { fieldName, data } = req.body; // Assuming you're sending a POST request with a JSON body

    // Define a mapping of field names to corresponding model attributes
    const fieldToAttributeMap = {
      fullName: "fullName",
      email: "email",
      phoneNumber: "phoneNumber",
      user_code: "user_code",
      gender: "gender",
      wallet: "wallet",
      homeAddress: "homeAddress",
      workAddress: "workAddress",
      otherAddress: "otherAddress",
      // Add more field mappings as needed
    };

    // Check if the provided field name is valid
    if (!fieldToAttributeMap[fieldName]) {
      return res.status(400).json({statusCode:400, error: "Invalid field name" });
    }

    const attribute = fieldToAttributeMap[fieldName];

    // Check if the data exists in the database
    const user = await User.findOne({
      where: { [attribute]: data },
    });

    if (user) {
      return res.send({
        statusCode:200,
        exists: true,
        message: "Data exists in the database.",
      });
    } else {
      return res.send({
        statusCode:400,
        exists: false,
        message: "Data does not exist in the database.",
      });
    }
  } catch (error) {
    return res.send({
      statusCode:500,
      status: false,
      message: "unable to verify user",
      error: utils.getMessage("ACCOUNT_EXISTENCE_ERROR"),
    });
  }
};

const updateAnyUserField = async (req, res) => {
  try {
    const { field, userCode, data } = req.body; // Assuming you're sending a POST request with a JSON body

    // Define a mapping of field names to corresponding model attributes
    const fieldToAttributeMap = {
      fullName: "fullName",
      email: "email",
      phoneNumber: "phoneNumber",
      user_code: "user_code",
      gender: "gender",
      wallet: "wallet",
      homeAddress: "homeAddress",
      workAddress: "workAddress",
      otherAddress: "otherAddress",
      // Add more field mappings as needed
    };

    // Check if the provided field name is valid
    if (!fieldToAttributeMap[field]) {
      return res.send({statusCode:400, error: "Invalid field name" });
    }

    const attribute = fieldToAttributeMap[field];

    // Update the field in the database for the specified userCode
    const [numOfUpdatedRows, updatedUsers] = await User.update(
      { [attribute]: data },
      {
        where: { user_code: userCode },
        returning: true, // Return the updated rows
      }
    );

    if (numOfUpdatedRows > 0) {
      return res.send({
        statusCode:200,
        success: true,
        message: "Field updated successfully",
        updatedUsers,
      });
    } else {
      return res.send({
        statusCode:404,
        success: false,
        message: "User not found or no changes made",
      });
    }
  } catch (error) {
    return res.send({
      statusCode:500,
      status: false,
      message: "unable to verify user",
      error: utils.getMessage("ACCOUNT_EXISTENCE_ERROR"),
    });
  }
};

const logOut = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (auth.isTokenInvalid(token)) {
      return res.send({
        statusCode:401,
        status: false,
        message: "Token is already invalidated",
        error: utils.getMessage("TOKEN_INVALID_ERROR"),
      });
    }

    // Invalidate the token (log out the user)
    auth.invalidateToken(token);

    return res.send({
      statusCode:200,
      status: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.send({
      statusCode:500,
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
  verifyAnyUserField,
  updateAnyUserField,
};
