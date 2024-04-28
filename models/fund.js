"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Fund extends Model {
    static associate(models) {
      Fund.hasMany(models.Transaction, { foreignKey: "fundId" });
      Fund.hasMany(models.Investment, { foreignKey: "fundId" });
    }
  }
  Fund.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: sequelize.literal("uuid_generate_v4()"),
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Fund Name can't be null!",
          },
          notEmpty: {
            msg: "Fund Name can't be empty!",
          },
        },
      },
      manager: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Investment Manager can't be null!",
          },
          notEmpty: {
            msg: "Investment Manager can't be empty!",
          },
        },
      },
      minInvestment: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Minimum Investment can't be null!",
          },
          notEmpty: {
            msg: "Minimum Investment can't be empty!",
          },
        },
      },
      NAV: DataTypes.DECIMAL(12, 4),
      NAVDate: DataTypes.DATE,
      fees: DataTypes.DECIMAL(12, 2),
    },
    {
      sequelize,
      modelName: "Fund",
      timestamps: false,
    }
  );
  return Fund;
};
