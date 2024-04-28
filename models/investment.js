"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Investment extends Model {
    static associate(models) {
      Investment.belongsTo(models.User, { foreignKey: "userId" });
      Investment.belongsTo(models.Fund, { foreignKey: "fundId" });
    }
  }
  Investment.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: sequelize.literal("uuid_generate_v4()"),
      },
      userId: DataTypes.INTEGER,
      fundId: DataTypes.UUID,
      currentUnit: DataTypes.DECIMAL(12, 4),
    },
    {
      sequelize,
      modelName: "Investment",
      timestamps: false,
    }
  );
  return Investment;
};
