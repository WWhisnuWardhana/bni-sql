const bcrypt = require("bcryptjs");

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

function validatePassword(hash, password) {
  return bcrypt.compareSync(hash, password);
}

module.exports = { hashPassword, validatePassword };
