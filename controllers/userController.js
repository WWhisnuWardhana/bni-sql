const { User, Fund } = require("../models/index");
const { validatePassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");
const ramdomNum = require("../helpers/randomizer");

class userController {
  static async register(req, res, next) {
    try {
      const { username, password } = req.body;
      const newUser = await User.create({
        username,
        password,
      });

      res.status(201).json({ newUser });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      if (!username || username.length === 0) {
        throw { name: "ReqUser" };
      }
      if (!password || password.length === 0) {
        throw { name: "ReqPass" };
      }
      let user = await User.findOne({ where: { username } });
      if (!user) {
        throw { name: "UserNotFound" };
      } else {
        const validPassword = validatePassword(password, user.password);
        if (!validPassword) {
          throw { name: "InvalidLogin" };
        } else {
          const payload = {
            id: user.id,
            username: user.username,
          };
          const access_token = createToken(payload);
          const funds = await Fund.findAll();
          const NAVDate = funds[0].NAVDate;
          const today = new Date();

          // For Testing
          // today.setDate(today.getDate() + 1);

          if (NAVDate.toLocaleDateString() !== today.toLocaleDateString()) {
            for (let el of funds) {
              await Fund.update(
                {
                  NAVDate: today,
                  NAV: ramdomNum(1000, 1500),
                },
                {
                  where: { id: el.id },
                }
              );
            }
          }
          res.status(200).json({ access_token });
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async topup(req, res, next) {
    try {
      const { amount } = req.body;
      const { userId } = req.loginInfo;
      const user = await User.findByPk(userId);
      if (!user) {
        throw { name: "UserNotFound" };
      }
      if (!amount || amount <= 0) {
        throw { name: "InvalidAmount" };
      }
      await user.increment("balance", { by: amount });
      res.status(200).json({ message: "Topup success" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = userController;
