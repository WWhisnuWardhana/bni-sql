"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );
    await queryInterface.createTable("Investments", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      fundId: {
        type: Sequelize.UUID,
        references: {
          model: "Funds",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      currentUnit: {
        type: Sequelize.DECIMAL(12, 4),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Investments");
  },
};
