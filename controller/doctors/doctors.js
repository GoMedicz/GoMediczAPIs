const Doctors = require("../../models/doctor_reg");
const bcrypt = require("bcrypt");
const { Auth } = require("../../middlewares/auth");
const { Utils } = require("../../middlewares/utils");
// const { Ratings } = require("../../models/users");
const {AppointmentReviews} = require("../../models/bookAppointment")
const AvailableTimes = require("../../models/availableTime");
const _ = require("lodash");
const moment = require("moment");
const upload = require("../multerConfig");
// const Sequelize = require('sequelize')
const { Op } = require("sequelize");
const { sq: sequelize } = require('../../config/database');



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
      return res.send({
        statusCode:400,
        message: "Doctor with this phone number exists",
        doctor: existingDoctor,
      });
    } else {
      return res.send({
        statusCode:404,
        status:false,
        message: "Request failed",
      });
    }
  } catch (error) {
    console.log(error);
    return res.send({
      statusCode:500,
      status: false,
      message: "Unable to check doctor existence",
      error: "UNKNOWN_ERROR",
    });

}
}




const doctorReg = async (req, res) => {
  try {

    const data = req.body; // Store the entire req.body object in 'data'


    // Check if a user with the same phoneNumber already exists
    const existingUser = await Doctors.findOne({
      where: { phoneNumber: data.phoneNumber },
    });

    if (existingUser) {
      return res.send({
        statusCode:400,
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
      wallet:data.wallet,
      serviceAt:data.serviceAt,
      specification:data.specification,
      services:data.services
    });

    // Create the user in the database

    // Generate token
    const token = auth.generateAuthToken(newDoctor);

    return res.send({
      statusCode:200,
      status:true,
      message: "Registration successful",
      data: newDoctor,
      wallet:newDoctor.wallet,
      token:token
    });
  } catch (error) {
    console.error("Error in verifying user:", error);
    return res.send({
      statusCode:500,
      status: false,
      message: "Unable to verify user",
      error: error.message, // Include the error message in the response
    });
  }
};

const docLogin = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      return res.send({
        statusCode:400,
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
      return res.send({
        status: false,
        statusCode:400,
        message: "Doctor does not exist",
        error: utils.getMessage(" ACCOUNT_EXISTENCE_ERROR"),
      });
    }
    //compare passwords
    const isMatchedPassword = await bcrypt.compare(password, doctors.password);
    if (!isMatchedPassword) {
      return res.send({
        statusCode:400,
        status: false,
        message: "invalid password",
        error: utils.getMessage(" PASSWORD_MATCH_ERROR"),
      });
    }
    //if password matches, generate a new token and send in the response
    const token = auth.generateAuthToken(doctors);
    return res.send({
      status: true,
      statusCode:200,
      message: "login succesfull",
      token: token,
      doctor_code:doctors.doctor_code,
      wallet:doctors.wallet
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: false,
      statusCode:500,
      message: "login failed",
      error: utils.getMessage("ACCOUNT_EXISTENCE_ERROR"),
    });
  }
};


const updateDoctorProfile = async (req, res) => {
  try {
    // Use Multer middleware to handle file uploads

    const userEmail = req.user.email; // Get the email from the user token

    const existingDoctor = await Doctors.findOne({
      where: { email: userEmail }, // Find the doctor by email
    });

    if (!existingDoctor) {
      return res.send({
        statusCode: 400,
        status: false,
        message: "Doctor not found",
      });
    }

    // Format the "lastLogin" timestamp
    const formattedLastLogin = moment().format("YYYY-MM-DD HH:mm:ss.SSS");

    // Create an object to store the update data
    const updateData = {};

    // Update fields individually based on your provided response data
    if (req.body.fullName) {
      updateData.fullName = req.body.fullName;
    }

    if (req.body.email) {
      updateData.email = req.body.email;
    }

    if (req.body.phoneNumber) {
      updateData.phoneNumber = req.body.phoneNumber;
    }

    if (req.body.hospital) {
      updateData.hospital = req.body.hospital;
    }

    if (req.body.about) {
      updateData.about = req.body.about;
    }

    if (req.body.profilePicture) {
      // Store the file name in the profilePicture property
      updateData.profilePicture = req.body.profilePicture;
    }

    if (req.body.gender) {
      updateData.gender = req.body.gender;
    }

    if (req.body.services) {
      updateData.services = req.body.services;
    }

    if (req.body.wallet) {
      updateData.wallet = req.body.wallet;
    }

    if (req.body.serviceAt) {
      updateData.serviceAt = req.body.serviceAt;
    }

    if (req.body.specification) {
      updateData.specification = req.body.specification;
    }

    if (req.body.experience) {
      updateData.experience = req.body.experience;
    }

    if (req.body.fees) {
      updateData.fees = req.body.fees;
    }

    // Check if req.file exists and add the profilePicture property if it does
    if (req.file) {
      // Store the file name in the profilePicture property
      updateData.profilePicture = req.file.filename;
    }

    // Add the lastLogin property
    updateData.lastLogin = formattedLastLogin;

    // Update the doctor's profile with the formatted "lastLogin" and other data
    const updatedDoctor = await existingDoctor.update(updateData);

    // Update or create AvailableTimes for the doctor
    await AvailableTimes.upsert({
      doctor_code: existingDoctor.doctor_code,
      available_days: req.body.available_days,
      available_start_time: req.body.available_start_time,
      available_end_time: req.body.available_end_time,
      minutesPerSection: req.body.minutesPerSection,
      available_months: req.body.available_months,
    });

    // Fetch the updated AvailableTimes for the doctor
    const doctorAvailableTimes = await AvailableTimes.findOne({
      where: { doctor_code: existingDoctor.doctor_code },
    });

    // Include the AvailableTimes data and the image file name in the response
    const responseData = {
      profilePicture: updateData.profilePicture, // Include the image file name
    };
   

    return res.send({
      statusCode: 200,
      status: true,
      message: "Doctor profile updated successfully",
      data: responseData,
    });
  } catch (error) {
    
    return res.send({
      statusCode: 500,
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
      return res.send({
        statusCode:400,
        status: false,
        message: "Rating and reviewComments are required",
      });
    }

    const existingDoctor = await Doctors.findOne({
      where: { doctor_code: data.doctorCode },
    });

    if (!existingDoctor) {
      return res.send({
        statusCode:404,
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

    return res.send({
      statusCode:200,
      status: true,
      message: "Rating submitted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode:400,
      status: false,
      message: "Failed to submit rating",
      error: error.message,
    });
  }
};

const DoctorProfile = async (req, res) => {
  try {
    const doctorCode = req.params.doctorCode;

    // Query AppointmentReviews to get all ratings for the doctor
    const reviews = await AppointmentReviews.findAll({
      where: { doctor_code: doctorCode },
      attributes: ["rating"],
    });

    // Calculate average rating
    const totalReviews = reviews.length;
    const sumRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalReviews > 0 ? sumRatings / totalReviews : 0;

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
        "specification",
        "lastLogin",
        "status",
        "profilePicture",
        "wallet",
        "longitude",
        "latitude",
        "gender",
        "services",
        "experience",
        "fees"
      ],
    });

    if (!doctorProfile) {
      return res.send({
        statusCode: 400,
        status: false,
        message: "Doctor profile not found",
      });
    }

    return res.send({
      statusCode: 200,
      status: true,
      message: "Doctor profile retrieved successfully",
      data: {
        ...doctorProfile.dataValues,
        totalRating: totalReviews, // You may need to adjust this based on your data model
        averageRating: averageRating,
      },
    });
  } catch (error) {
    console.error(error);
    return res.send({
      statusCode: 500,
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
      return res.send({
        statusCode:404,
        status: false,
        message: 'Doctor not found',
      });
    }

    return res.send({
      statusCode:200,
      status: true,
      message: 'Doctor information retrieved successfully',
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    return res.send({
      statusCode:500,
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

    return res.send({
      statusCode:200,
      status: true,
      message: "Search results retrieved successfully",
      data: doctors,
    });
  } catch (error) {
    return res.send({
      statusCode:500,
      status: false,
      message: "Failed to search doctors",
      error: error.message,
    });
  }
};

const verifyAnyDoctorField = async (req, res) => {
  try {
    const { fieldName, data } = req.body; // Assuming you're sending a POST request with a JSON body

    // Define a mapping of field names to corresponding model attributes
    const fieldToAttributeMap = {
      fullName: 'fullName',
      email: 'email',
      phoneNumber: 'phoneNumber',
      doctor_code: 'doctor_code',
      hospital: 'hospital',
      about: 'about',
      profilePicture: 'profilePicture',
      gender: 'gender',
      wallet: 'wallet',
      serviceAt: 'serviceAt',
      specialties: 'specialties',
      pharmacyCode: 'pharmacyCode',
      reviewComments: 'reviewComments',
      // Add more field mappings as needed
    };

    // Check if the provided field name is valid
    if (!fieldToAttributeMap[fieldName]) {
      return res.status(400).json({ error: 'Invalid field name' });
    }

    const attribute = fieldToAttributeMap[fieldName];

    // Check if the data exists in the database
    const doctor = await Doctors.findOne({
      where: { [attribute]: data },
    });

    if (doctor) {
      return res.send({ statusCode:200, exists: true, message: 'Data exists in the database.' });
    } else {
      return res.send({
        statusCode: 404,
        status: 'error',
        exists: false,
        message: 'Data does not exist in the database.',
      });

    }
  } catch (error) {
    return res.send({
      statusCode:500,
      status: false,
      message: "Failed to verify field",
      error: error.message,
    });
  }
}

const updateAnyDoctorField = async (req, res) => {
  try {
    const { field, doctorCode, data } = req.body; // Assuming you're sending a POST request with a JSON body

    // Define a mapping of field names to corresponding model attributes
    const fieldToAttributeMap = {
      fullName: 'fullName',
      email: 'email',
      phoneNumber: 'phoneNumber',
      doctor_code: 'doctor_code',
      hospital: 'hospital',
      about: 'about',
      profilePicture: 'profilePicture',
      gender: 'gender',
      wallet: 'wallet',
      serviceAt: 'serviceAt',
      specialties: 'specialties',
      pharmacyCode: 'pharmacyCode',
      reviewComments: 'reviewComments',
      // Add more field mappings as needed
    };

    // Check if the provided field name is valid
    if (!fieldToAttributeMap[field]) {
      return res.send({ statusCode:400, error: 'Invalid field name' });
    }

    const attribute = fieldToAttributeMap[field];

    // Update the field in the database for the specified doctorCode
    const [numOfUpdatedRows, updatedDoctors] = await Doctors.update(
      { [attribute]: data },
      {
        where: { doctor_code: doctorCode },
        returning: true, // Return the updated rows
      }
    );

    if (numOfUpdatedRows > 0) {
      return res.json({ statusCode:200, success: true, message: 'Field updated successfully', updatedDoctors });
    } else {
      return res.json({statusCode:404, success: false, message: 'Doctor not found or no changes made' });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to update field",
      error: error.message,
    });
  }
}

const docLogOut = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (auth.isTokenInvalid(token)) {
      return res.send({
        statusCode:400,
        status: false,
        message: "Token is already invalidated",
        error: utils.getMessage("TOKEN_INVALID_ERROR"),
      });
    }

    // Invalidate the token (log out the user)
    auth.invalidateToken(token);

    return res.send({
      statusCode:400,
      status: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.send({
      statusCode:400,
      status: false,
      message: "Logout failed",
      error: utils.getMessage("LOGOUT_ERROR"),
    });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctors.findAll({
      attributes: [
        "fullName",
        "email",
        "phoneNumber",
        "hospital",
        "about",
        "reviewComments",
        "isPharmacyOwner",
        "pharmacyCode",
        "serviceAt",
        "specification",
        "lastLogin",
        "status",
        "profilePicture",
        "wallet",
        "longitude",
        "latitude",
        "gender",
        "services",
        "experience",
        "fees"
      ]
    });

    if (!doctors || doctors.length === 0) {
      const response = {
        status: false,
        message: "No doctors found in the database",
        statusCode: 404,
      };
      return res.send(response);
    }

    const response = {
      status: true,
      message: "Doctors' profiles retrieved successfully",
      statusCode: 200,
      data: doctors,
    };
    return res.send(response);
  } catch (error) {
    console.error(error);
    const response = {
      status: false,
      message: "Failed to retrieve doctors' profiles",
      error: error.message,
      statusCode: 500,
    };
    return res.send(response);
  }
};

const deleteDoctorByPhoneNumber = async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber;

    // Check if the doctor exists with the provided phoneNumber
    const existingDoctor = await Doctors.findOne({
      where: { phoneNumber: phoneNumber },
    });

    if (!existingDoctor) {
      return res.status(404).json({
        status: false,
        message: 'Doctor not found',
      });
    }

    // Perform the deletion of the doctor
    await existingDoctor.destroy();

    return res.status(200).json({
      status: true,
      message: 'Doctor deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: 'Failed to delete doctor',
      error: error.message,
    });
  }
};







module.exports = {
  doctorReg,
  docLogin,
  deleteDoctorByPhoneNumber,
  docLogOut,
  updateDoctorProfile,
  searchDoctors,
  DoctorProfile,
  submitRating,
  getDoctorByPhoneNumber,
  verifyDoctorWithPhone,
  verifyAnyDoctorField,
  updateAnyDoctorField,
  getAllDoctors
};
