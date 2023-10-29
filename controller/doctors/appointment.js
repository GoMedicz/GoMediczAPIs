
const Doctors = require('../../models/doctor_reg');

const multer = require('multer');
const path = require('path');
const {User} = require('../../models/users')
const {AppointmentReviews,Appointments}=require("../../models/bookAppointment")
const {uploadLabReport} = require("../multerConfig")
const { sq } = require('../../config/database')


const generateAppointmentCode = () => {
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

const bookAppointment = async (req, res) => {
  try {
    const { appointmentDate, appointmentReason, doctor_code, appointmentTime } = req.body;
    console.log(req.body);
    const userEmail = req.user.email; // Assuming user is authenticated

    // Check if lab report was uploaded
    const labReportFileName = req.file ? req.file.filename : null;

    console.log(req.file); // Log the entire req.file object
console.log(req.file.filename);

    // Generate a unique appointment code
    const appointmentCode = generateAppointmentCode();

    // Find the user by email
    const user = await User.findOne({ where: { email: userEmail } });

    if (!user) {
      return res.send({
        statusCode: 400,
        status: false,
        message: 'User not found',
      });
    }

    const userCode = user.user_code;

    // Create a new appointment entry
    const appointment = await Appointments.create({
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime,
      appointmentReason: appointmentReason,
      doctor_code: doctor_code,
      userEmail: userEmail,
      labReportFileName: labReportFileName, // Store the file name
      appointment_code: appointmentCode,
      user_code: userCode,
    });
    

    // Increment totalAppointmentsBooked in the Doctors model
    await Doctors.increment('totalAppointmentsBooked', {
      by: 1,
      where: { doctor_code: doctor_code },
    });

    // Include the lab report file name in the response data
    return res.send({
      statusCode: 200,
      status: true,
      message: 'Appointment booked successfully',
      data: {
        ...appointment.toJSON(),
        labReportFileName: labReportFileName,
      },
    });
  } catch (error) {
    console.error(error);
    return res.send({
      statusCode: 500,
      status: false,
      message: 'Failed to book appointment',
      error: error.message,
    });
  }
};

  const submitAppointmentReview = async (req, res) => {
    try {
        const data = req.body;
        const userEmail = req.user.email; // Assuming user is authenticated
        console.log('User email:', userEmail);

        // Validate the request data
        if (!data.appointment_code || !data.doctor_code || !data.rating || !data.reviewComments) {
            return res.send({
                statusCode: 400,
                status: false,
                message: "Invalid data. Please provide appointment_code, doctor_code, rating, and reviewComments.",
            });
        }
        console.log('Appointment code from request:', data.appointment_code);

        // Retrieve user code from the authenticated user
        const user = await User.findOne({ where: { email: userEmail } });
        if (!user) {
            return res.send({
                statusCode: 400,
                status: false,
                message: 'User not found',
            });
        }

        const userCode = user.user_code;

        // Check if the appointment exists and is associated with the user
        // const existingAppointment = await Appointments.findOne({
        //     where: {
        //         appointment_code: data.appointment_code,
        //         user_code: userCode,
        //     },
        // });
        // // console.log('Query result (existingAppointment):', existingAppointment);

        // if (!existingAppointment) {
        //     return res.send({
        //         statusCode: 404,
        //         status: false,
        //         message: "Appointment not found or not associated with the user.",
        //     });
        // }

        // Create a new appointment review entry
        await AppointmentReviews.create({
            appointment_code: data.appointment_code,
            user_code: userCode,
            doctor_code: data.doctor_code,
            rating: data.rating,
            reviewComments: data.reviewComments,
            date_reviewed: new Date(),
        });

        // Update the totalRating field in the Doctors model (you may need to calculate the average rating)

        // Return a success response
        return res.send({
            statusCode: 200,
            status: true,
            message: "Rating and review submitted successfully.",
        });
    } catch (error) {
        console.error(error);
        return res.send({
            statusCode: 500,
            status: false,
            message: "Failed to submit rating and review.",
            error: error.message,
        });
    }
};
const getAppointmentReviewsByDoctorCode = async (req, res) => {
  try {
    const doctorCode = req.params.doctorCode;

    const appointmentReviews = await AppointmentReviews.findAll({
      where: { doctor_code: doctorCode },
      include: [
        {
          model: sq.models.tbl_users,
          as: 'user',
          attributes: ['fullName', 'profilePicture'],
        },
      ],
    });

    if (appointmentReviews.length === 0) {
      return res.send({
        statusCode: 404,
        status: false,
        message: "No appointment reviews found for the specified doctor.",
      });
    }

    const responseData = appointmentReviews.map((review) => ({
      // Include all appointment review properties
      // Example: id: review.id, rating: review.rating, comment: review.reviewComments, etc.
      id: review.id,
      rating: review.rating,
      reviewComments: review.reviewComments,
      date_reviewed: review.date_reviewed,
      totalRating: review.totalRating,
      totalAppointmentsBooked: review.totalAppointmentsBooked,
      // Include the user properties
      user: review.user
        ? {
            fullName: review.user.fullName,
            profilePicture: review.user.profilePicture,
          }
        : null,
    }));

    return res.send({
      statusCode: 200,
      status: true,
      appointmentReviews: responseData,
    });
  } catch (error) {
    console.error(error);
    return res.send({
      statusCode: 500,
      status: false,
      message: "Failed to retrieve appointment reviews",
      error: error.message,
    });
  }
};


const getAllAppointments = async (req, res) => {
  try {
    // Query the database to get all appointments
    const appointments = await Appointments.findAll();
    
    // Check if there are no appointments
    if (!appointments) {
      return res.status(200).json({
        statusCode: 200,
        status: true,
        message: 'No appointments found',
        data: [],
      });
    }

    // If appointments are found, return them in the response
    return res.status(200).json({
      statusCode: 200,
      status: true,
      message: 'Appointments retrieved successfully',
      data: appointments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      status: false,
      message: 'Failed to retrieve appointments',
      error: error.message,
    });
  }
};

const getAppointmentsUnderDoctor = async (req, res) => {
  try {
    const doctorCode = req.params.doctorCode; // Assuming you can get the doctor's code from the request parameters

    // Fetch appointments and associated user details
    const appointments = await Appointments.findAll({
      where: { doctor_code: doctorCode },
      include: [
        {
          model: sq.models.tbl_users,
          as: 'user',
          attributes: ['fullName', 'profilePicture'],
        },
      ],
      attributes: ['appointmentDate', 'appointmentTime', 'appointmentReason'],
    });

    if (appointments.length === 0) {
      return res.send({
        statusCode: 200,
        status: true,
        message: "No appointments found for the specified doctor.",
        data: [],
      });
    }

    const responseData = appointments.map((appointment) => ({
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      appointmentReason: appointment.appointmentReason,
      user: {
        fullName: appointment.user.fullName,
        profilePicture: appointment.user.profilePicture,
      },
    }));

    return res.send({
      statusCode: 200,
      status: true,
      message: "Appointments retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    return res.send({
      statusCode: 500,
      status: false,
      message: "Failed to retrieve appointments",
      error: error.message,
    });
  }
};



  module.exports = {
    getAllAppointments,
    bookAppointment,
    submitAppointmentReview,
    getAppointmentReviewsByDoctorCode,
    getAppointmentsUnderDoctor

  }