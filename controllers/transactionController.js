const currencyFormat = require("../helpers/currency");
const { User, Fund, Transaction, Investment } = require("../models/index");

class transactionController {
  static async transactionList(req, res, next) {
    try {
      const { username } = req.loginInfo;
      let transactions = await Transaction.findAll(
        {
          include: {
            model: User,
            attributes: ["id", "username"],
            where: { username },
          },
        },

        { order: [["id", "ASC"]] }
      );
      transactions.length === 0
        ? res.status(200).json({ message: "No transactions has been made" })
        : res.status(200).json({ transactions });
    } catch (error) {
      next(error);
    }
  }

  static async buy(req, res, next) {
    try {
      const { fundId, amount } = req.body;
      const { userId } = req.loginInfo;
      const fund = await Fund.findByPk(fundId);
      const user = await User.findByPk(userId);
      if (!fund) {
        throw { name: "InvalidFund" };
      }

      if (!amount || amount <= 0) {
        throw { name: "InvalidAmount" };
      }

      if (amount < fund.minInvestment) {
        return res.status(400).json({
          message: `Minimum Investment is ${currencyFormat(
            fund.minInvestment
          )}!`,
        });
      }
      if (user.balance < amount) {
        throw { name: "InBalance" };
      } else {
        const newTransaction = await Transaction.create({
          userId,
          fundId,
          unit: amount / fund.NAV,
          type: "buy",
          method: "QR Code",
          amount,
          totalAmount: amount * (1 + Number(fund.fees)),
        });
        if (user.balance < newTransaction.totalAmount) {
          await Transaction.destroy({ where: { id: newTransaction.id } });
          throw { name: "InBalance" };
        }
        const investment = await Investment.findOne({
          where: { userId, fundId },
        });
        if (!investment) {
          await Investment.create({
            userId,
            fundId,
            currentUnit: newTransaction.unit,
          });
        } else {
          await investment.increment("currentUnit", {
            by: newTransaction.unit,
          });
        }
        await user.decrement("balance", { by: newTransaction.totalAmount });
        let result = await Transaction.findByPk(newTransaction.id, {
          include: {
            model: Fund,
            attributes: ["NAV", "NAVDate", "fees"],
            where: { id: fundId },
          },
        });
        res.status(201).json({
          transaction: result,
          message: `Successfully bought ${newTransaction.unit} unit of ${
            fund.name
          } with total amount ${currencyFormat(newTransaction.totalAmount)} `,
        });
      }
    } catch (error) {
      next(error);
    }
  }
  static async sell(req, res, next) {
    try {
      const { investmentId, unit } = req.body;
      const { userId } = req.loginInfo;
      const investment = await Investment.findByPk(investmentId);

      if (!unit || unit > investment.currentUnit) {
        throw { name: "InvalidTransaction" };
      }
      const fund = await Fund.findByPk(investment.fundId);
      const user = await User.findByPk(userId);
      const amount = unit * fund.NAV;
      const newTransaction = await Transaction.create({
        userId,
        fundId: investment.fundId,
        type: "sell",
        method: "Bank Transfer",
        unit,
        amount,
        totalAmount: amount * (1 - Number(fund.fees)),
      });
      await investment.decrement("currentUnit", {
        by: unit,
      });
      if (investment.currentUnit <= 0) {
        await investment.destroy();
      }
      let result = await Transaction.findByPk(newTransaction.id, {
        include: {
          model: Fund,
          attributes: ["NAV", "NAVDate", "fees"],
          where: { id: investment.fundId },
        },
      });
      await user.increment("balance", { by: newTransaction.totalAmount });

      res.status(201).json({
        transaction: result,
        message: `Successfully sold ${newTransaction.unit} unit of ${
          fund.name
        } with total amount ${currencyFormat(newTransaction.totalAmount)} `,
      });
    } catch (error) {
      next(error);
    }
  }
  static async switch(req, res, next) {
    try {
      const { investmentId, switchFundId, unit } = req.body;
      const { userId } = req.loginInfo;
      const investment = await Investment.findByPk(investmentId);
      if (!unit || unit > investment.currentUnit) {
        throw { name: "InvalidTransaction" };
      }
      const fund = await Fund.findByPk(investment.fundId);
      const switchFund = await Fund.findByPk(switchFundId);
      if (!switchFund || !fund) {
        throw { name: "InvalidFund" };
      }
      if (fund.manager !== switchFund.manager) {
        throw { name: "InvalidSwitch" };
      }
      const amount = unit * switchFund.NAV;
      const newTransaction = await Transaction.create({
        userId,
        fundId: switchFund.id,
        type: "switch",
        method: "Switch Funds",
        unit,
        amount,
        totalAmount: amount * (1 - Number(switchFund.fees)),
      });
      await investment.decrement("currentUnit", {
        by: unit,
      });
      if (investment.currentUnit <= 0) {
        await investment.destroy();
      }
      const newInvestment = await Investment.findOne({
        where: { userId, fundId: switchFund.id },
      });
      if (!newInvestment) {
        await Investment.create({
          userId,
          fundId: switchFund.id,
          currentUnit: unit,
        });
      } else {
        await newInvestment.increment("currentUnit", {
          by: unit,
        });
      }
      let result = await Transaction.findByPk(newTransaction.id, {
        include: {
          model: Fund,
          attributes: ["NAV", "NAVDate", "fees"],
          where: { id: switchFund.id },
        },
      });

      res.status(201).json({
        transaction: result,
        message: `Successfully switched ${newTransaction.unit} unit of ${
          fund.name
        } to ${switchFund.name} with total amount ${currencyFormat(
          newTransaction.totalAmount
        )} `,
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = transactionController;
