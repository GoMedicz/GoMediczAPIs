


module.exports = (sequelize,DataTypes)=>{
    const Withdrawal = sequelize.define('Withdrawal', {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            },
            doctor_code: {
              type: DataTypes.STRING,
              allowNull: false
            },
    
            wallet: {
              type: DataTypes.STRING,
              allowNull: false
            },
           amount: {
              type: DataTypes.INTEGER,
              allowNull: false
            },
            bank_code: {
              type: DataTypes.STRING,
              allowNull: false
            },
            bank_name: {
              type: DataTypes.STRING,
              allowNull: false
            },
           account_number: {
              type: DataTypes.STRING,
              allowNull: false
            },
            account_name: {
              type: DataTypes.STRING,
              allowNull: false
            },
            date_request: {
              type: DataTypes.DATE,
              allowNull: true
            },
            date_paid: {
              type: DataTypes.DATE,
              allowNull: true
            },
            branch_code: {
              type: DataTypes.STRING,
              allowNull: true
            },
    
            status: {
              type: DataTypes.STRING,
              allowNull: true
            },
            transaction_mode: {
              type: DataTypes.STRING,
              allowNull: false
            },
            transaction_ref: {
              type: DataTypes.TEXT,
              allowNull: true
            },
      },{
        indexes: [
            // Index for the 'doctor_code' field for quick lookup by doctor code
            {
                fields: ['doctor_code'],
            },
            // Index for the 'wallet' field for quick lookup by wallet
            {
                fields: ['wallet'],
            },
            // Index for the 'bank_code' field for quick lookup by bank code
            {
                fields: ['bank_code'],
            },
            // Index for the 'account_number' field for quick lookup by account number
            {
                fields: ['account_number'],
            },
            // Index for the 'transaction_mode' field for quick lookup by transaction mode
            {
                fields: ['transaction_mode'],
            },
            // ... add more indexes as needed ...
        ],
    },{
        sequelize,freezeTableName:true,timestamps:true
    }
    );

    return Withdrawal;
}