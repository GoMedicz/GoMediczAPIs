'use strict';
require("dotenv").config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

// this is according to the docs
const sequelize = new Sequelize(process.env.dataBaseUrl,{
  dialect:"postgres",
   pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
    }
});

// This is our concern
fs
// reads each file
  .readdirSync(__dirname)
//   filters out only javascript files which will be all the models outside this particular file
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
// here, it is instantiating the models automatically and storing the models created into a "db" object
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

//   Here, we already have a db object with all the models, so we just associate any model needed as specified in the model file
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// here, we're storing our db connection "sequelize" and our ORM tool object "Sequelize" too into the db Object then we export
db.sequelize = sequelize;
db.Sequelize = Sequelize;


/**
 * Hence, this db Object ;
 * 1. All Models
 * 2. The Database connection
 * 3. Sequelize Object for helper functions
 *  */ 
module.exports = db;