// const { sq } = require('../config/database');
// const Sequelize = require('sequelize');
// const { DataTypes } = require('sequelize');
// const Doctors = require('./doctor_reg')



module.exports = (sequelize,DataTypes)=>{

  const AvailableTime = sequelize.define('AvailableTime', {
    doctor_code: {
      type: DataTypes.STRING,
    },
    appointment_code: {
      type: DataTypes.STRING,
    },
    available_days: {
      type: DataTypes.JSON,
  
    },
    available_start_time: {
      type: DataTypes.TIME,
    },
    available_end_time: {
      type: DataTypes.TIME,
  
    },
    minutesPerSection: {
      type: DataTypes.INTEGER,
  
    },
    available_months: {
      type: DataTypes.JSON,
  
    },
  },{
    sequelize,freezeTableName:true,timestamps:true
  });

  // This is made so as to automatically associate all models needed when looping
  
  AvailableTime.associate = (models)=>{
    // instead of manually importing Doctor model and associating, this will automatically do that when looping
    AvailableTime.belongsTo(models.Doctor, {
      foreignKey: 'doctor_code',
    });
  }

  return AvailableTime;
}

