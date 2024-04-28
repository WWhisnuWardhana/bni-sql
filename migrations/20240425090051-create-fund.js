"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );
    await queryInterface.createTable("Funds", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      manager: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      minInvestment: { allowNull: false, type: Sequelize.INTEGER },
      NAV: {
        type: Sequelize.DECIMAL(12, 4),
      },
      NAVDate: {
        type: Sequelize.DATE,
      },
      fees: {
        type: Sequelize.DECIMAL(12, 2),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Funds");
  },
};
