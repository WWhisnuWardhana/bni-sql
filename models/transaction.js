"use strict";
const { Model } = require("sequelize");
const ramdomNum = require("../helpers/randomizer");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User, { foreignKey: "userId" });
      Transaction.belongsTo(models.Fund, { foreignKey: "fundId" });
    }
  }
  Transaction.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: sequelize.literal("uuid_generate_v4()"),
      },
      userId: DataTypes.INTEGER,
      fundId: DataTypes.UUID,
      dateTime: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      type: {
        type: DataTypes.STRING,
        validate: {
          isIn: {
            args: [["buy", "sell", "switch"]],
            msg: "Transaction Type must either be 'buy', 'sell', or 'switch'",
          },
        },
      },
      method: DataTypes.STRING,
      unit: DataTypes.DECIMAL(12, 4),
      amount: DataTypes.DECIMAL(12, 2),
      totalAmount: DataTypes.DECIMAL(12, 2),
    },
    {
      sequelize,
      modelName: "Transaction",
      timestamps: false,
    }
  );
  return Transaction;
};
