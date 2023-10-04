"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_doctors", "fullName", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("tbl_doctors", "email", {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    });

    await queryInterface.addColumn("tbl_doctors", "phoneNumber", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("tbl_doctors", "password", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("tbl_doctors", "specialties", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("tbl_doctors", "profilePicture", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("tbl_doctors", "hospital", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("tbl_doctors", "about", {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn("tbl_doctors", "availableTimes", {
      type: Sequelize.JSON,
    });
    await queryInterface.addColumn("tbl_doctors", "doctor_code", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("tbl_doctors", "serviceAt", {
      type: Sequelize.JSON,
    });
    await queryInterface.addColumn("tbl_doctors", "lastLogin", {
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn("tbl_doctors", "status", {
      type: Sequelize.BOOLEAN,
    });
    await queryInterface.addColumn("tbl_doctors", "isPharmacyOwner", {
      type: Sequelize.BOOLEAN,
    });
    await queryInterface.addColumn("tbl_doctors", "pharmacyCode", {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_doctors", "fullName");
    await queryInterface.removeColumn("tbl_doctors", "email");
    await queryInterface.removeColumn("tbl_doctors", "phoneNumber");
    await queryInterface.removeColumn("tbl_doctors", "password");
    await queryInterface.removeColumn("tbl_doctors", "specialties");
    await queryInterface.removeColumn("tbl_doctors", "profilePicture");
    await queryInterface.removeColumn("tbl_doctors", "hospital");
    await queryInterface.removeColumn("tbl_doctors", "about");
    await queryInterface.removeColumn("tbl_doctors", "availableTimes");
    await queryInterface.removeColumn("tbl_doctors", "doctor_code");
    await queryInterface.removeColumn("tbl_doctors", "serviceAt");
    await queryInterface.removeColumn("tbl_doctors", "lastLogin");
    await queryInterface.removeColumn("tbl_doctors", "status");
    await queryInterface.removeColumn("tbl_doctors", "isPharmacyOwner");
    await queryInterface.removeColumn("tbl_doctors", "pharmacyCode");
  },
};
