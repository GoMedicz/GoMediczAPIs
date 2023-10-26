const joi = require('joi')
const {Utils} = require('./utils') 

const utils = new Utils

const validation = joi.object({
    // Name: joi.string().trim(true).required(),
    email: joi.string().email().trim(true).required(),
    otp:joi.string().required(),
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
    phoneNumber: joi.string().trim().required(),
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
    phoneNumber: joi.string().required(),
    password: joi.string().min(5).required(),
    wallet: joi.string(),
    serviceAt:joi.array(),
    specification:joi.array(),
    services:joi.array(),

  });

  const userOtpValidation = async (req, res, next) => {
    try {
      const validated = verifyOtpVal.validate(req.body);
      if (validated.error) {
        res.status(400);
        return res.json({
          error: utils.getMessage("DATA_VALIDATION_ERROR"),
          statusCode:400
        });
      }
      next();
    } catch (error) {
      console.log(error);
    }
  };

  const userRegValidation = joi.object({
    fullName: joi.string().trim(true).required(),
    email: joi.string().email().trim(true).required(),
    phoneNumber: joi.string().required(),
    password: joi.string().min(5).required(),
    wallet: joi.string()


  });

  const userRegV = async (req, res, next) => {
    try {
      const validated = userRegValidation.validate(req.body);
      if (validated.error) {
        res.status(400);
        return res.json({
          error: utils.getMessage("DATA_VALIDATION_ERROR"),
          statusCode:400
        });
      }
      next();
    } catch (error) {
      console.log(error);
    }
  };

  const doctorRegVal = joi.object({
    otp:joi.string().required(),
    phoneNumber: joi.string().required(),
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
    phoneNumber: joi.string().trim(true).required(),
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





  const paymentVal = joi.object({
    doctor_code: joi.string().required(),
    wallet: joi.string().required(),
    appointment_code: joi.string().required(),
    user_code: joi.string().required(),
    amount: joi.string(),
    discount:joi.string(),
    payer:joi.string(),
    reference:joi.string(),
    payment_data:joi.string(),
    date_paid:joi.string(),
    method:joi.string()

  });

  const paymentValidation = async (req, res, next) => {
    try {
      const validated = paymentVal.validate(req.body);
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

  const withdrawalVal = joi.object({
    doctor_code: joi.string().required(),
    wallet: joi.string().required(),
    bank_code: joi.string().required(),
    amount: joi.string(),
    account_number:joi.string(),
    bank_name:joi.string(),
    account_name:joi.string(),
    date_request:joi.string(),
    date_paid:joi.string(),
    branch_code:joi.string(),
    status:joi.string(),
    transaction_mode:joi.string(),
    transaction_ref:joi.string(),

  });

  const withdrawalValidation = async (req, res, next) => {
    try {
      const validated = withdrawalVal.validate(req.body);
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











  module.exports = {
    userValidation,
    loginValidate,
    userOtpValidation,
    docValidation,
    docLogin,
    userRegV,
    paymentValidation,
    withdrawalValidation
    
  
    // updateDoctorProfileValidation
  }