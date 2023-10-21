
const Doctors = require('../../models/doctor_reg');
const Appointments = require("../../models/bookAppointment");
const multer = require('multer');
const path = require('path');

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
      const { appointmentDate, appointmentReason, doctorCode } = req.body;
      const userEmail = req.user.email; // Assuming user is authenticated
  
      // Upload the lab report (if provided)
      uploadLabReport.single('labReport')(req, res, async (err) => {
        if (err) {
          return res.status(400).json({
            status: false,
            message: 'Lab report upload failed',
            error: err.message,
          });
        }
  
        // Check if lab report was uploaded
        const labReportPath = req.file ? req.file.path : null;
  
        // Construct the URL for the lab report
        const labReportUrl = labReportPath ? `https://localhost:5190/${labReportPath}` : null;

        const appointmentCode = generateDoctorCode()
  
        // Create a new appointment entry
        const appointment = await Appointments.create({
          appointmentDate: appointmentDate,
          appointmentReason: appointmentReason,
          doctorCode: doctorCode,
          userEmail: userEmail,
          labReportPath: labReportPath,
          appointment_code:appointmentCode // Assign the lab report path if uploaded
        });
  
        // Increment totalAppointmentsBooked in the Doctors model
        await Doctors.increment('totalAppointmentsBooked', {
          by: 1,
          where: { doctor_code: doctorCode },
        });
  
        // Include the lab report URL in the response data
        return res.status(200).json({
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
      return res.status(500).json({
        status: false,
        message: 'Failed to book appointment',
        error: error.message,
      });
    }
  };
  



  module.exports = {
    bookAppointment
  }