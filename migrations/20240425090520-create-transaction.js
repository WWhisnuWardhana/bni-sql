"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );

    await queryInterface.createTable("Transactions", {
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
      dateTime: {
        type: Sequelize.DATE,
      },
      type: {
        type: Sequelize.STRING,
      },
      method: {
        type: Sequelize.STRING,
      },
      unit: {
        type: Sequelize.DECIMAL(12, 4),
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
      },
      totalAmount: {
        type: Sequelize.DECIMAL(12, 2),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Transactions");
  },
};
