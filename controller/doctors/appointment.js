
const Doctors = require('../../models/doctor_reg');

const multer = require('multer');
const path = require('path');
const {User} = require('../../models/users')
const {AppointmentReviews,Appointments}=require("../../models/bookAppointment")

// Define the storage for lab reports using multer
const labReportStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/lab_reports'); // Store lab reports in the 'uploads/lab_reports' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext); // Generate a unique filename for the lab report
  },
});

const uploadLabReport = multer({ storage: labReportStorage });

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
      const { appointmentDate, appointmentReason, doctor_code } = req.body;
      const userEmail = req.user.email; // Assuming user is authenticated
     
    
  
      // Upload the lab report (if provided)
      uploadLabReport.single('labReport')(req, res, async (err) => {
        if (err) {
          return res.send({
            statusCode:400,
            status: false,
            message: 'Lab report upload failed',
            error: err.message,
          });
        }
  
        // Check if lab report was uploaded
        const labReportPath = req.file ? req.file.path : null;
  
        // Construct the URL for the lab report
        const labReportUrl = labReportPath ? `https://localhost:5190/${labReportPath}` : null;

        const appointmentCode = generateAppointmentCode()
        const user = await User.findOne({ where: { email: userEmail } });
      if (!user) {
        return res.send({
          statusCode:400,
          status: false,
          message: 'User not found',
        });
      }
      const userCode = user.user_code;
  
        // Create a new appointment entry
        const appointment = await Appointments.create({
          appointmentDate: appointmentDate,
          appointmentReason: appointmentReason,
          doctor_code: doctor_code,
          userEmail: userEmail,
          labReportPath: labReportPath,
          appointment_code:appointmentCode,
          user_code: userCode
           // Assign the lab report path if uploaded

        });
  
        // Increment totalAppointmentsBooked in the Doctors model
        await Doctors.increment('totalAppointmentsBooked', {
          by: 1,
          where: { doctor_code: doctor_code },
        });
  
        // Include the lab report URL in the response data
        return res.send({
          statusCode:200,
          status: true,
          message: 'Appointment booked successfully',
          data: {
            ...appointment.toJSON(),
            labReportUrl: labReportUrl,
          },
        });
      });
    } catch (error) {
      console.error(error);
      return res.send({
        statusCode:500,
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
        const existingAppointment = await Appointments.findOne({
            where: {
                appointment_code: data.appointment_code,
                user_code: userCode,
            },
        });
        console.log('Query result (existingAppointment):', existingAppointment);

        if (!existingAppointment) {
            return res.send({
                statusCode: 404,
                status: false,
                message: "Appointment not found or not associated with the user.",
            });
        }

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
    });

    if (appointmentReviews.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        status: false,
        message: "No appointment reviews found for the specified doctor.",
      });
    }

    return res.status(200).json({
      statusCode: 200,
      status: true,
      appointmentReviews,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      status: false,
      message: "Failed to retrieve appointment reviews",
      error: error.message,
    });
  }
};

  



  module.exports = {
    bookAppointment,
    submitAppointmentReview,
    getAppointmentReviewsByDoctorCode
  }