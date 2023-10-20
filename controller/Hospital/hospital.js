const Doctors = require("../../models/doctor_reg");
const Hospitals = require("../../models/hospitals");
const bcrypt = require("bcrypt");
const { Auth } = require("../../middlewares/auth");
const { Utils } = require("../../middlewares/utils");

const utils = new Utils();
const auth = new Auth();

const generateHospitalCode = () => {
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


// Create Hospital Profile
const createHospitalProfile = async (req, res) => {
  try {
    const { name, address, facilities, departments } = req.body;

    if (!name || !address || !facilities || !departments) {
      return res.status(400).json({ error: "Required fields missing" });
    }
    const hospitalCode = generateHospitalCode();

    const hospital = await Hospitals.create({
      name: name,
      address: address,
      facilities: facilities,
      departments: departments,
      hospital_code:hospitalCode
    });

    return res
      .status(201)
      .json({
        message: "Hospital profile created successfully",
        data: hospital,
        hospital_code:hospital_code
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        error: "Failed to create hospital profile",
        message: error.message,
      });
  }
};

// Update Hospital Profile
const updateHospitalProfile = async (req, res) => {
  try {
    const hospitalId = req.params.hospitalId;
    const { name, address, facilities, departments, about } = req.body;

    if (!name && !address && !facilities && !departments) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const hospital = await Hospitals.findByPk(hospitalId);

    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    if (name) {
      hospital.name = name;
    }
    if (address) {
      hospital.address = address;
    }
    if (facilities) {
      hospital.facilities = facilities;
    }
    if (about) {
      hospital.about = about;
    }
    if (departments) {
      hospital.departments = departments;
    }

    await hospital.save();

    return res
      .status(200)
      .json({
        message: "Hospital profile updated successfully",
        data: hospital,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        error: "Failed to update hospital profile",
        message: error.message,
      });
  }
};

// Search Hospitals
const searchHospitals = async (req, res) => {
  try {
    const { name, address, facilities, departments } = req.query;

    const criteria = {};

    if (name) {
      criteria.name = name;
    }
    if (address) {
      criteria.address = address;
    }
    if (facilities) {
      criteria.facilities = facilities;
    }
    if (departments) {
      criteria.departments = departments;
    }

    const hospitals = await Hospitals.findAll({
      where: criteria,
      attributes: ["Name", "Address", "Facilities", "Departments"],
    });

    return res
      .status(200)
      .json({ message: "Hospitals retrieved successfully", data: hospitals });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to search hospitals", message: error.message });
  }
};

module.exports = {
  updateHospitalProfile,
  createHospitalProfile,
  searchHospitals,
};
