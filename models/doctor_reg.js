const { sq } = require('../config/database')
const {DataTypes} = require('sequelize')
const {User, Ratings} = require("./users")


const Doctors = sq.define('tbl_doctors',{
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    password: {
        type: DataTypes.STRING,
        allowNull:false,
    },
    doctor_code: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true, // Add primaryKey constraint
        unique: true,     // Add unique constraint
      },
    hospital: {
        type: DataTypes.STRING,
    },
    about: {
        type: DataTypes.TEXT,
    },

    profilePicture: {
        type: DataTypes.STRING, // New field for profile picture URL
    },
    gender: {
      type: DataTypes.STRING,
  },
  services: {
    type: DataTypes.JSON,
},
  wallet: {
    type: DataTypes.STRING,
    unique: true
},
    serviceAt: {
        type: DataTypes.JSON, // List of hospitals the doctor services at
    },
    specification: {
        type: DataTypes.JSON,
    },
    experience: {
      type: DataTypes.STRING,
  },
  fees: {
    type: DataTypes.STRING,
},
    lastLogin: {
        type: DataTypes.DATE,
    },
    status: {
        type: DataTypes.BOOLEAN,
        default:false,
    },
    totalRating: {
        type:  DataTypes.DECIMAL,
        defaultValue: 0, // Set an appropriate default value
      },

      totalAppointmentsBooked: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // Set an appropriate default value
      },

    isPharmacyOwner: {
        type: DataTypes.BOOLEAN,
        default:false
    },
    pharmacyCode: {
        type: DataTypes.STRING,
    },
    reviewComments: {
        type: DataTypes.TEXT,
      },
      longitude: {
        type: DataTypes.DOUBLE, // Field for storing longitude
      },
      latitude: {
        type: DataTypes.DOUBLE, // Field for storing latitude
      },
}, {
    indexes: [
      // Index for the 'email' field for quick lookup by email
      {
        unique: true,
        fields: ['email']
      },
      // Index for the 'doctor_code' field for quick lookup by doctor code
      {
        unique: true,
        fields: ['doctor_code']
      },
      // Index for the 'fullName' field for partial search by name
      {
        fields: ['fullName']
      },
      // Index for the 'hospital' field for quick lookup by hospital name
      {
        fields: ['hospital']
      },
      // Index for the 'status' field for filtering active/inactive doctors
      {
        fields: ['status']
      },
      // Composite index for multiple fields (example: 'status' and 'isPharmacyOwner')
      {
        fields: ['status', 'isPharmacyOwner']
      },
      {
        unique: true,
        fields: ['wallet']
      }
    ]
  });

// Doctors.hasMany(Ratings, { foreignKey: 'doctorCode' });

Doctors.sync({force:true}).then(() => {
    console.log('Doctors model synced');
});

module.exports = Doctors;
