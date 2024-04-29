const { Fund } = require("../models/index");
const randomNum = require("../helpers/randomizer");
const { Op } = require("sequelize");

class fundController {
  static async fundList(req, res, next) {
    try {
      let funds = await Fund.findAll();
      res.status(200).json({ funds });
    } catch (error) {
      next(error);
    }
  }
  static async findById(req, res, next) {
    try {
      const { id } = req.params;
      let funds = await Fund.findByPk(id);
      if (!funds) {
        throw { name: "InvalidFund" };
      }
      res.status(200).json({ funds });
    } catch (error) {
      next(error);
    }
  }

  static async findByManager(req, res, next) {
    try {
      const { manager } = req.params;
      let funds = await Fund.findAll({
        where: {
          manager: {
            [Op.iLike]: `%${manager}%`,
          },
        },
      });
      res.status(200).json({ funds });
    } catch (error) {
      next(error);
    }
  }

  static async createFund(req, res, next) {
    try {
      let { name, minInvestment, manager, NAV, fees } = req.body;

      if (!NAV) {
        NAV = randomNum(1000, 1500);
      }

      if (!fees) {
        fees = randomNum(1, 5) / 100;
      }

      let newFunds = await Fund.create({
        name,
        minInvestment,
        manager,
        NAV,
        NAVDate: new Date(),
        fees,
      });
      res.status(201).json({ newFunds });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = fundController;
