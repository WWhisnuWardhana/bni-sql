"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Transaction, { foreignKey: "userId" });
      User.hasMany(models.Investment, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Username is already taken" },
        validate: {
          notNull: {
            msg: "Username can't be null",
          },
          notEmpty: {
            msg: "Username can't be empty",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password can't be null",
          },
          notEmpty: {
            msg: "Password can't be empty",
          },
          len: {
            args: [5],
            msg: "Minimal password length is 5!",
          },
        },
      },
      balance: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          notNull: {
            msg: "Balance can't be null",
          },
          notEmpty: {
            msg: "Balance can't be empty",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: false,
      hooks: {
        beforeCreate: (user, options) => {
          user.password = hashPassword(user.password);
        },
        beforeUpdate: (user, options) => {
          user.password = hashPassword(user.password);
        },
      },
    }
  );
  return User;
};
