const multer = require('multer');
const path = require('path');

// Define storage for the uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/doctors/profile-for-profiles'); // Set the destination folder where images will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext); // Set the image file name
  },
});

// Define file filter for image uploads (optional)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create the Multer instance with the storage and file filter
const upload = multer({ storage, fileFilter });



const labReportStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/doctors/appointment-for-appointments'); // Store lab reports in the 'uploads/lab_reports' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext); // Generate a unique filename for the lab report
  },
});

// Define a custom file filter function
const labReportFileFilter = (req, file, cb) => {
  // Check the file type by its MIME type or extension
  const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg','text/plain']; // Include 'image/jpg' for JPEG images

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type'), false); // Reject the file
  }
};

const uploadLabReport = multer({
  storage: labReportStorage,
  fileFilter: labReportFileFilter, // Set the custom file filter
});

// Now you can use the uploadLabReport middleware to accept both document and image files.



module.exports = {upload,uploadLabReport}
