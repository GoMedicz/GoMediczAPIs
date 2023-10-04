const Doctors = require("../../models/doctor_reg");
const bcrypt = require("bcrypt");
const { Auth } = require("../../middlewares/auth");
const { Utils } = require("../../middlewares/utils");
const { Ratings } = require("../../models/users");
const AvailableTimes = require("../../models/availableTime");
const _ = require("lodash");
const moment = require("moment");
const upload = require("../multerConfig");
// const Sequelize = require('sequelize')
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
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
};

const sendOtp = async (phoneNumber, otp) => {
  try {
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

const doctorReg = async (req, res) => {
  try {
    const data = req.body;

    const existingUser = await Doctors.findOne({
      $or: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email or phone number already exists",
        error: utils.getMessage("USER_ALREADY_EXISTS"),
      });
    }

    // Send OTP to the user's phone number
    await sendOtp(data.phoneNumber, data.otp);
    console.log("OTP sent successfully");

    // Return success response
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Unable to register user",
      error: utils.getMessage("UNKNOWN_ERROR"),
    });
  }
};

const verifyDoctorOtp = async (req, res) => {
  try {
    const data = req.body; // Store the entire req.body object in 'data'

    // Verify OTP on the frontend
    // ...
    // Check if a user with the same phoneNumber already exists
    const existingUser = await Doctors.findOne({
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

    const doctorCode = generateDoctorCode();
    const newDoctor = await Doctors.create({
      doctor_code: doctorCode,
      phoneNumber: data.phoneNumber,
      email: data.email,
      fullName: data.fullName,
      password: hashedPassword,
    });

    // Create the user in the database

    // Generate token
    const token = auth.generateAuthToken(newDoctor);

    return res.status(200).json({
      message: "Registration successful",
      data: newDoctor,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Unable to verify user",
      error: utils.getMessage("UNKNOWN_ERROR"),
    });
  }
};

const Doclogin = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      return res.status(400).json({
        status: false,
        message: " see invalid credentials",
        error: utils.getMessage(" DATA_VALIDATION_ERROR"),
      });
    }
    //find user
    const doctors = await Doctors.findOne({
      where: { phoneNumber: phoneNumber },
    });
    if (!doctors) {
      return res.status(400).json({
        status: false,
        message: "Doctor does not exist",
        error: utils.getMessage(" ACCOUNT_EXISTENCE_ERROR"),
      });
    }
    //compare passwords
    const isMatchedPassword = await bcrypt.compare(password, doctors.password);
    if (!isMatchedPassword) {
      return res.status(400).json({
        status: false,
        message: "invalid password",
        error: utils.getMessage(" PASSWORD_MATCH_ERROR"),
      });
    }
    //if password matches, generate a new token and send in the response
    const token = auth.generateAuthToken(doctors);
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

const updateDoctorProfile = async (req, res) => {
  try {
    // Use Multer middleware to handle file uploads
    upload.single("profilePicture")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          status: false,
          message: "Profile picture upload failed",
          error: err.message,
        });
      }

      const data = req.body;
      const existingDoctor = await Doctors.findOne({
        where: { email: data.email },
      });

      if (!existingDoctor) {
        return res.status(404).json({
          status: false,
          message: "Doctor not found",
        });
      }

      // Format the "lastLogin" timestamp
      const formattedLastLogin = moment().format("YYYY-MM-DD HH:mm:ss.SSS");

      // Update the doctor's profile (excluding availableTimes) with the formatted "lastLogin"
      const updatedDoctor = await existingDoctor.update(
        {
          ...data,
          lastLogin: formattedLastLogin,
          // Store the profile picture filename in the database
          profilePicture: req.file.filename, // req.file contains the uploaded file information
        },
        {
          where: { email: existingDoctor.email },
          returning: true,
        }
      );

      // Update or create AvailableTimes for the doctor
      await AvailableTimes.upsert({
        doctor_code: existingDoctor.doctor_code,
        available_days: data.available_days,
        available_start_time: data.available_start_time,
        available_end_time: data.available_end_time,
        minutesPerSection: data.minutesPerSection,
        available_months: data.available_months,
      });

      // Fetch the updated AvailableTimes for the doctor
      const doctorAvailableTimes = await AvailableTimes.findOne({
        where: { doctor_code: existingDoctor.doctor_code },
      });

      // Include the AvailableTimes data in the response
      const responseData = {
        ...updatedDoctor.toJSON(),
        availableTimes: doctorAvailableTimes.toJSON(),
      };

      return res.status(200).json({
        status: true,
        message: "Doctor profile updated successfully",
        data: responseData,
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Unable to update doctor profile",
      error: error.message,
    });
  }
};

const submitRating = async (req, res) => {
  try {
    const data = req.body;
    const userEmail = req.user.email; // Assuming user is authenticated

    if (!data.rating || !data.reviewComments) {
      return res.status(400).json({
        status: false,
        message: "Rating and reviewComments are required",
      });
    }

    const existingDoctor = await Doctors.findOne({
      where: { doctor_code: data.doctorCode },
    });

    if (!existingDoctor) {
      return res.status(404).json({
        status: false,
        message: "Doctor not found",
      });
    }

    // Create a new rating entry
    await Ratings.create({
      doctorCode: data.doctorCode,
      userEmail: userEmail,
      rating: data.rating,
      reviewComments: data.reviewComments, // Include reviewComments in the creation
    });

    // Update the totalRating and totalAppointmentsBooked fields in the Doctors model
    await Doctors.increment("totalRating", {
      by: data.rating,
      where: { doctor_code: data.doctorCode },
    });

    return res.status(200).json({
      status: true,
      message: "Rating submitted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Failed to submit rating",
      error: error.message,
    });
  }
};

const DoctorProfile = async (req, res) => {
  try {
    const doctorCode = req.params.doctorCode;

    // Query Ratings table to get all ratings for the doctor
    const ratings = await Ratings.findAll({
      where: { doctorCode: doctorCode },
      attributes: ["rating"],
    });

    // Calculate average rating
    const totalRatings = ratings.length;
    const sumRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    // Retrieve doctor's profile information, including the new fields
    const doctorProfile = await Doctors.findOne({
      where: { doctor_code: doctorCode },
      attributes: [
        "fullName",
        "email",
        "phoneNumber",
        "hospital",
        "about",
        "totalRating",
        "totalAppointmentsBooked",
        "reviewComments",
        "isPharmacyOwner",
        "pharmacyCode",
        "serviceAt",
        "specialties",
        "lastLogin",
        "status",
      ],
    });

    if (!doctorProfile) {
      return res.status(404).json({
        status: false,
        message: "Doctor profile not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Doctor profile retrieved successfully",
      data: {
        ...doctorProfile.dataValues,
        averageRating: averageRating,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Failed to retrieve doctor profile",
      error: error.message,
    });
  }
};


const getDoctorByPhoneNumber = async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber;
    const doctor = await Doctors.findOne({ where: { phoneNumber: phoneNumber } });

    if (!doctor) {
      return res.status(404).json({
        status: false,
        message: 'Doctor not found',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Doctor information retrieved successfully',
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: 'Failed to retrieve doctor information',
      error: error.message,
    });
  }
};


const searchDoctors = async (req, res) => {
  try {
    const { fullName, hospital, specialties } = req.query;

    // Build a query object to filter doctors based on search criteria
    const query = {};

    if (fullName) {
      query.fullName = {
        [Op.iLike]: `%${fullName}%`, // Case-insensitive search for fullName
      };
    }

    if (hospital) {
      query.hospital = {
        [Op.iLike]: `%${hospital}%`, // Case-insensitive search for hospital
      };
    }

    if (specialties) {
      query.specialties = {
        [Op.iLike]: `%${specialties}%`, // Case-insensitive search for specialties
      };
    }

    // Query the database with the constructed query object
    const doctors = await Doctors.findAll({
      where: query,
    });

    return res.status(200).json({
      status: true,
      message: "Search results retrieved successfully",
      data: doctors,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Failed to search doctors",
      error: error.message,
    });
  }
};

const DoclogOut = async (req, res) => {
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
  doctorReg,
  verifyDoctorOtp,
  Doclogin,
  DoclogOut,
  updateDoctorProfile,
  searchDoctors,
  DoctorProfile,
  submitRating,
  getDoctorByPhoneNumber
};
