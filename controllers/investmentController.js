const { Investment } = require("../models/index");

class investmentController {
  static async myInvestments(req, res, next) {
    try {
      const { userId } = req.loginInfo;
      let investment = await Investment.findAll({ where: { userId } });
      investment.length === 0
        ? res
            .status(200)
            .json({ message: "You don't have any investments yet!" })
        : res.status(200).json({ investment });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = investmentController;
