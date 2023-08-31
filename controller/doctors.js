const Doctors = require("../models/doctor_reg");
const bcrypt = require("bcrypt");
const { Auth } = require("../middlewares/auth");
const { Utils } = require("../middlewares/utils");
const Ratings = require("../models/ratings");
const _ = require("lodash");

const utils = new Utils();
const auth = new Auth();
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

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
    const { Email, PhoneNumber } = req.body;
    if (!Email || !PhoneNumber) {
      return res.status(401).json({
        message: "fields cannot be empty",
        error: utils.getMessage("DATA_ERROR"),
      });
    }
    const existingUser = await Doctors.findOne({
      $or: [{ Email }, { PhoneNumber }],
    });
    if (existingUser) {
      return res.status(409).json({
        message: "User with this email or phone number already exists",
        error: utils.getMessage("USER_ALREADY_EXISTS"),
      });
    }
    // Get OTP and PhoneNumber from the frontend
    const { otp } = req.body;
    // Send OTP to the user's phone number
    await sendOtp(PhoneNumber, otp);
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

const verifyDoctorOtp = async (req, res) => {
  try {
    const {
      Email,
      PhoneNumber,
      otp,
      Password,
      confirmPassword,
      Specialty,
      Hospital,
    } = req.body;

    // Verify OTP on the frontend
    // ...

    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create the user in the database
    const newDoctor = await Doctors.create({
      PhoneNumber: PhoneNumber,
      Email: Email,
      Name: req.body.Name,
      Password: hashedPassword,
      Specialty: Specialty,
      Hospital: Hospital,
    });

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
      message: "unable to verify user",
      error: utils.getMessage("UNKNOWN_ERROR"),
    });
  }
};

const Doclogin = async (req, res) => {
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
    const doctors = await Doctors.findOne({ where: { Email: Email } });
    if (!doctors) {
      return res.status(400).json({
        status: false,
        message: "Doctor does not exist",
        error: utils.getMessage(" ACCOUNT_EXISTENCE_ERROR"),
      });
    }
    //compare passwords
    const isMatchedPassword = await bcrypt.compare(Password, doctors.Password);
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
    const { Email, Specialty, Hospital, About, AvailableTimes } = req.body;

    // Check if the doctor exists
    const existingDoctor = await Doctors.findOne({ where: { Email: Email } });
    console.log(existingDoctor);
    if (!existingDoctor) {
      return res.status(404).json({
        status: false,
        message: "Doctor not found",
      });
    }
    const formattedAvailableTimes = AvailableTimes.map((timeSlot) => {
      return {
        day: timeSlot.day,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
      };
    });

    // Update the doctor's profile
    const updatedDoctor = await existingDoctor.update(
      {
        Specialty: Specialty,
        Hospital: Hospital,
        About: About,
        AvailableTimes: formattedAvailableTimes,
      },
      {
        where: { Email: existingDoctor.Email },
        returning: true, // This will return the updated record
      }
    );
    console.log(updatedDoctor);

    return res.status(200).json({
      status: true,
      message: "Doctor profile updated successfully",
      data: updatedDoctor,
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
    const { doctorEmail, rating } = req.body;
    const userEmail = req.user.email; // Assuming user is authenticated

    const existingDoctor = await Doctors.findOne({
      where: { Email: doctorEmail },
    });
    console.log(existingDoctor);
    if (!existingDoctor) {
      return res.status(404).json({
        status: false,
        message: "Doctor not found",
      });
    }

    // Create a new rating entry
    await Ratings.create({
      doctorEmail: doctorEmail,
      userEmail: userEmail,
      rating: rating,
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
    const doctorEmail = req.params.doctorEmail;

    // Query Ratings table to get all ratings for the doctor
    const ratings = await Ratings.findAll({
      where: { doctorEmail: doctorEmail },
      attributes: ["rating"],
    });

    // Calculate average rating
    const totalRatings = ratings.length;
    const sumRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    // Retrieve doctor's other profile information
    const doctorProfile = await Doctors.findOne({
      where: { Email: doctorEmail },
      attributes: ["Name", "Specialty", "About", "AvailableTimes"],
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
const searchDoctors = async (req, res) => {
  try {
    const { specialty, name, hospital } = req.query;

    // Build the query conditions based on the provided parameters
    const conditions = {};
    if (specialty) {
      conditions.Specialty = specialty;
    }
    if (name) {
      conditions.Name = name;
    }
    if (hospital) {
      conditions.Hospital = hospital;
    }

    // Query the database with the conditions
    const doctors = await Doctors.findAll({
      where: conditions,
      attributes: ["Name", "Specialty", "Hospital"],
    });

    return res.status(200).json({
      status: true,
      message: "Doctors retrieved successfully",
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
};
