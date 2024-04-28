const { Investment, Fund } = require("../models/index");
const authorization = async (req, res, next) => {
  try {
    const { userId, switchFundId } = req.loginInfo;
    const { investmentId } = req.body;
    const investment = await Investment.findByPk(investmentId);
    const fund = await Fund.findByPk(switchFundId);
    if (!investment) {
      throw { name: "NoInvest" };
    }
    if (switchFundId && !fund) {
      throw { name: "InvalidFund" };
    }
    if (investment.userId !== userId) {
      throw { name: "Forbidden" };
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authorization;
