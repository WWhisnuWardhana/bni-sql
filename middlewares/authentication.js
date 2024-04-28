const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models/index");

const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw { name: "Unauthorized" };
    }
    const accessToken = authorization.split(" ")[1];
    const payload = verifyToken(accessToken);
    const user = await User.findOne({ where: { username: payload.username } });
    if (!user) {
      throw { name: "Unauthorized" };
    }

    req.loginInfo = {
      userId: user.id,
      username: user.username,
    };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
