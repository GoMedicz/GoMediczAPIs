const Doctors = require("../models/doctor_reg");
const Hospitals= require("../models/hospitals");
const bcrypt = require("bcrypt");
const { Auth } = require("../middlewares/auth");
const { Utils } = require("../middlewares/utils");

const utils = new Utils();
const auth = new Auth();



// Create Hospital Profile
const createHospitalProfile = async (req, res) => {
    try {
        const { name, address, facilities, departments } = req.body;

        if (!name || !address || !facilities || !departments) {
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const hospital = await Hospitals.create({
            Name: name,
            Address: address,
            Facilities: facilities,
            Departments: departments,
        });

        return res.status(201).json({ message: 'Hospital profile created successfully', data: hospital });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create hospital profile', message: error.message });
    }
};

// Update Hospital Profile
const updateHospitalProfile = async (req, res) => {
    try {
        const hospitalId = req.params.hospitalId;
        const { name, address, facilities, departments, about } = req.body;

        if (!name && !address && !facilities && !departments) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        const hospital = await Hospitals.findByPk(hospitalId);

        if (!hospital) {
            return res.status(404).json({ error: 'Hospital not found' });
        }

        if (name) {
            hospital.Name = name;
        }
        if (address) {
            hospital.Address = address;
        }
        if (facilities) {
            hospital.Facilities = facilities;
        }
        if (about) {
            hospital.About = about;
        }
        if (departments) {
            hospital.Departments = departments;
        }

        await hospital.save();

        return res.status(200).json({ message: 'Hospital profile updated successfully', data: hospital });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update hospital profile', message: error.message });
    }
};

// Search Hospitals
const searchHospitals = async (req, res) => {
    try {
        const { name, address, facilities, departments } = req.query;

        const criteria = {};

        if (name) {
            criteria.Name = name;
        }
        if (address) {
            criteria.Address = address;
        }
        if (facilities) {
            criteria.Facilities = facilities;
        }
        if (departments) {
            criteria.Departments = departments;
        }

        const hospitals = await Hospitals.findAll({
            where: criteria,
            attributes: ['Name', 'Address', 'Facilities', 'Departments'],
        });

        return res.status(200).json({ message: 'Hospitals retrieved successfully', data: hospitals });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to search hospitals', message: error.message });
    }
};


module.exports = {updateHospitalProfile,createHospitalProfile,searchHospitals }
