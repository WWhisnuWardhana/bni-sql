const jwt = require("jsonwebtoken");

function createToken(payload) {
  return jwt.sign(payload, process.env.secret);
}

function verifyToken(token) {
  return jwt.verify(token, process.env.secret);
}

module.exports = { createToken, verifyToken };
