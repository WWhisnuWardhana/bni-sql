const request = require("supertest"); // seperti axios
const app = require("../app");
const { createToken } = require("../helpers/jwt");
const { sequelize } = require("../models");
const ramdomNum = require("../helpers/randomizer");
const { hashPassword } = require("../helpers/bcrypt");

const payload = {
  userId: 1,
  username: "wahyu",
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

// FUND LIST
describe("GET /funds", () => {
  describe("GET /funds - succeed", () => {
    it("should an array of funds", async () => {
      let response = await request(app)
        .get("/funds")
        .set("Authorization", `Bearer ${access_token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe("GET /funds - error", () => {
    it("Has not login, should return an object with authentication error message", async () => {
      let response = await request(app).get(`/funds`);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Authentication Error, please login first!"
      );
    });

    it("invalid token, should return an object with authentication error message", async () => {
      let response = await request(app)
        .get(`/funds`)
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

//FUND BY ID
describe("GET /funds/:id", () => {
  describe("GET /funds/:id - succeed", () => {
    it("should show fund with the same id", async () => {
      let fund = await request(app)
        .get("/funds")
        .set("Authorization", `Bearer ${access_token}`);
      let response = await request(app)
        .get(`/funds/${fund.body.funds[0].id}`)
        .set("Authorization", `Bearer ${access_token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe("GET /funds/:id - error", () => {
    it("unregistered id, should show an object with error message", async () => {
      let response = await request(app)
        .get(`/funds/6401acb2-94a1-4d0d-9fa4-8f62743b4cd6`)
        .set("Authorization", `Bearer ${access_token}`);

      expect(response.status).toBe(404);
      console.log(response.error);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "There are no Mutual Funds with that ID!"
      );
    });

    it("invalid data type id, should show an object with error message", async () => {
      let response = await request(app)
        .get(`/funds/6`)
        .set("Authorization", `Bearer ${access_token}`);

      expect(response.status).toBe(400);
      console.log(response.error);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Invalid Data Type");
    });

    it("Has not login, should return an object with authentication error message", async () => {
      let response = await request(app).get(
        `/funds/6401acb2-94a1-4d0d-9fa4-8f62743b4cd6`
      );
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Authentication Error, please login first!"
      );
    });

    it("invalid token, should return an object with authentication error message", async () => {
      let response = await request(app)
        .get(`/funds/6401acb2-94a1-4d0d-9fa4-8f62743b4cd6`)
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
