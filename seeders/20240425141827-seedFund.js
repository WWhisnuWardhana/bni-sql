"use strict";
const ramdomNum = require("../helpers/randomizer");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const funds = require("../data/funds.json");
    let data = funds.map((el) => {
      el.NAV = ramdomNum(1000, 1500);
      el.NAVDate = new Date();
      el.fees = ramdomNum(1, 5) / 100;
      return el;
    });

    await queryInterface.bulkInsert("Funds", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Funds", null, {});
  },
};
