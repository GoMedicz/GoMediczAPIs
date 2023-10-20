const { Auth } = require("../../middlewares/auth");
const { Utils } = require("../../middlewares/utils");
const Labs = require("../../models/labs");

const utils = new Utils();
const auth = new Auth();

const generateLabCode = () => {
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
const createLabs = async (req, res) => {
  try {
    const { name, address, facilities, departments } = req.body;

    if (!name || !address || !facilities || !departments) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const labCode = generateLabCode();

    const labs = await Labs.create({
      name: name,
      address: address,
      facilities: facilities,
      departments: departments,
      lab_code: labCode,
    });

    return res
      .status(201)
      .json({
        message: "lab profile created successfully",
        data: labs,
        lab_code: lab_code,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to create lab profile", message: error.message });
  }
};

// Update Hospital Profile
const updateLabs = async (req, res) => {
  try {
    const LabId = req.params.LabId;
    console.log("Received LabId:", LabId);
    const { name, address, facilities, departments, about } = req.body;

    if (!name && !address && !facilities && !departments) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const lab = await Labs.findByPk(LabId);

    if (!lab) {
      return res.status(404).json({ error: "lab not found" });
    }

    if (name) {
      lab.name = name;
    }
    if (address) {
      lab.address = address;
    }
    if (facilities) {
      lab.facilities = facilities;
    }
    if (about) {
      lab.about = about;
    }
    if (departments) {
      lab.departments = departments;
    }

    await lab.save();

    return res
      .status(200)
      .json({ message: "Lab profile updated successfully", data: lab });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to update lab profile", message: error.message });
  }
};

// Search Hospitals
const searchLabs = async (req, res) => {
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

    const labs = await Labs.findAll({
      where: criteria,
      attributes: ["Name", "Address", "Facilities", "Departments"],
    });

    return res
      .status(200)
      .json({ message: "labs retrieved successfully", data: labs });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to search labs", message: error.message });
  }
};

module.exports = { updateLabs, createLabs, searchLabs };
