

module.exports = (sequelize,DataTypes)=>{
  
  const User = sequelize.define(
    "User",
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
      },
      user_code: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true, // Add primaryKey constraint
        unique: true, // Add unique constraint
      },
      gender: {
        type: DataTypes.STRING,
      },
      wallet: {
        type: DataTypes.STRING,
        unique: true,
      },
      homeAddress: {
        type: DataTypes.STRING,
      },
      profilePicture: {
        type: DataTypes.STRING,
      },
      workAddress: {
        type: DataTypes.STRING,
      },
      otherAddress: {
        type: DataTypes.STRING,
      },
    },
    {
      indexes: [
        // Index for the 'email' field for quick lookup by email
        {
          unique: true,
          fields: ["email"],
        },
        // Index for the 'user code' field for quick lookup by user code
        {
          unique: true,
          fields: ["user_code"],
        },
        // Index for the 'phoneNumber' field for quick lookup by phone number
        {
          unique: true,
          fields: ["phoneNumber"],
        },
        {
          unique: true,
          fields: ["wallet"],
        },
        // Index for the 'name' field for partial search by name
        {
          fields: ["fullName"],
        },
        // Composite index for multiple fields (example: 'homeAddress' and 'workAddress')
        {
          fields: ["homeAddress", "workAddress"],
        },
        // ... add more indexes as needed ...
      ],
    },{
      sequelize,freezeTableName:true,timestamps:true
    }
  );

  return User;
}

