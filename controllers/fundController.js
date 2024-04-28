const { Fund } = require("../models/index");

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
}
module.exports = fundController;
