const joi = require('joi')
const {Utils} = require('./utils') 

const utils = new Utils

const validation = joi.object({
    // Name: joi.string().trim(true).required(),
    email: joi.string().email().trim(true).required(),
    // otp:joi.string().required(),
    phoneNumber: joi.string().required(),
    // Password: joi.string().min(5).required(),
    // confirmPassword: joi.string().min(5).required()
  });

  const userValidation = async (req, res, next) => {
    try {
      const validated = validation.validate(req.body);
      if (validated.error) {
        res.status(400);
        return res.json({
          error: utils.getMessage("DATA_VALIDATION_ERROR"),
        });
      }
      next();
    } catch (error) {
      console.log(error);
    }
  };

  const LoginValidation = joi.object({
    email: joi.string().email().trim(true).required(),
    password: joi.string().min(5).required()
  });

  const loginValidate = async (req, res, next) => {
    try {
      const validated = LoginValidation.validate(req.body);
      if (validated.error) {
        res.status(400);
        return res.json({
          error: utils.getMessage("DATA_VALIDATION_ERROR"),
        });
      }
      next();
    } catch (error) {
      console.log(error);
    }
  };

  const verifyOtpVal = joi.object({
    fullName: joi.string().trim(true).required(),
    email: joi.string().email().trim(true).required(),
    otp:joi.string().required(),
    phoneNumber: joi.string().required(),
    password: joi.string().min(5).required(),
    confirmPassword: joi.string().min(5).required()
  });

  const userOtpValidation = async (req, res, next) => {
    try {
      const validated = verifyOtpVal.validate(req.body);
      if (validated.error) {
        res.status(400);
        return res.json({
          error: utils.getMessage("DATA_VALIDATION_ERROR"),
        });
      }
      next();
    } catch (error) {
      console.log(error);
    }
  };

  const doctorRegVal = joi.object({
    fullName: joi.string().trim(true).required(),
    email: joi.string().email().trim(true).required(),
    otp:joi.string().required(),
    phoneNumber: joi.string().required(),
    password: joi.string().min(5).required(),
    confirmPassword: joi.string().min(5).required()
  });

  const docValidation = async (req, res, next) => {
    try {
      const validated = doctorRegVal.validate(req.body);
      if (validated.error) {
        res.status(400);
        return res.json({
          error: utils.getMessage("DATA_VALIDATION_ERROR"),
        });
      }
      next();
    } catch (error) {
      console.log(error);
    }
  };



  const doctorLogin = joi.object({
    phoneNumber: joi.string().email().trim(true).required(),
    password: joi.string().min(5).required(),
  });

  const docLogin = async (req, res, next) => {
    try {
      const validated = doctorLogin.validate(req.body);
      if (validated.error) {
        res.status(400);
        return res.json({
          error: utils.getMessage("DATA_VALIDATION_ERROR"),
        });
      }
      next();
    } catch (error) {
      console.log(error);
    }
  };



  // const updateDoctorProfileVal = joi.object({
  //   email: joi.string().email().trim(true).required(),
  //   otp:joi.string().required(),
  //   phoneNumber: joi.string().required(),
  //   password: joi.string().min(5).required(),
  //   confirmPassword: joi.string().min(5).required()
  // });

  // const updateDoctorProfileValidation = async (req, res, next) => {
  //   try {
  //     const validated = updateDoctorProfileVal.validate(req.body);
  //     if (validated.error) {
  //       res.status(400);
  //       return res.json({
  //         error: utils.getMessage("DATA_VALIDATION_ERROR"),
  //       });
  //     }
  //     next();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };









  module.exports = {
    userValidation,
    loginValidate,
    userOtpValidation,
    docValidation,
    docLogin
    // updateDoctorProfileValidation
  }