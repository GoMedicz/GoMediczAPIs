const multer = require('multer');
const path = require('path');

// Define storage for the uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination folder where images will be stored
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
    cb(null, 'uploads/lab_reports'); // Store lab reports in the 'uploads/lab_reports' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext); // Generate a unique filename for the lab report
  },
});

const uploadLabReport = multer({ storage: labReportStorage });




module.exports = {upload,uploadLabReport}
