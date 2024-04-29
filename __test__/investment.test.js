const request = require("supertest"); // seperti axios
const app = require("../app");
const { createToken } = require("../helpers/jwt");
const { sequelize } = require("../models");
const ramdomNum = require("../helpers/randomizer");
const { hashPassword } = require("../helpers/bcrypt");

const payload = {
  userId: 2,
  username: "whisnu",
};
access_token = createToken(payload);

beforeAll(async () => {
  const users = require("../data/users.json");
  let data = users.map((el) => {
    el.password = hashPassword(el.password);
    return el;
  });

  const funds = require("../data/funds.json");
  let dataFund = funds.map((el) => {
    el.NAV = ramdomNum(1000, 1500);
    el.NAVDate = new Date();
    el.fees = ramdomNum(1, 5) / 100;
    return el;
  });
  await sequelize.queryInterface.bulkInsert("Users", data, {});
  await sequelize.queryInterface.bulkInsert("Funds", dataFund, {});
});

// INVESTMENTS LIST
describe("GET /investments", () => {
  describe("GET /investments - succeed", () => {
    it("should show an array of transactions if any", async () => {
      let fund = await request(app)
        .get("/funds")
        .set("Authorization", `Bearer ${access_token}`);

      let fundId = fund.body.funds[0].id;
      const body = {
        fundId,
        amount: 100000,
      };
      await request(app)
        .post("/transactions/buy")
        .set("Authorization", `Bearer ${access_token}`)
        .send(body);
      let response = await request(app)
        .get("/investments")
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe("GET /investments - error", () => {
    it("Has not login, should return an object with authentication error message", async () => {
      let response = await request(app).get("/investments");
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Authentication Error, please login first!"
      );
    });

    it("invalid token, should return an object with authentication error message", async () => {
      let response = await request(app)
        .get("/investments")
        .set("Authorization", `Bearer invalid`);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Authentication Error, invalid token"
      );
    });
  });
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await sequelize.queryInterface.bulkDelete("Funds", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});
