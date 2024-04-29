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

// BUY
describe("post /transactions/buy", () => {
  describe("post /transactions/buy - succeed", () => {
    it("buy, should create new transaction and success message", async () => {
      let user = await request(app)
        .get("/profile")
        .set("Authorization", `Bearer ${access_token}`);
      console.log(user, "<<<<<<< ini user");

      let fund = await request(app)
        .get("/funds")
        .set("Authorization", `Bearer ${access_token}`);

      let fundId = fund.body.funds[0].id;
      const body = {
        fundId: fundId,
        amount: 100000,
      };
      let response = await request(app)
        .post("/transactions/buy")
        .set("Authorization", `Bearer ${access_token}`)
        .send(body);
      console.log(response.error, "ini response error");
      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe("POST /transactions/buy - error", () => {
    it("Not enough balance", async () => {
      let fund = await request(app)
        .get("/funds")
        .set("Authorization", `Bearer ${access_token}`);

      let fundId = fund.body.funds[0].id;
      const body = {
        fundId,
        amount: 9999999,
      };
      let response = await request(app)
        .post("/transactions/buy")
        .set("Authorization", `Bearer ${access_token}`)
        .send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Not Enough Balance!");
    });

    it("unregistered Fund Id", async () => {
      const body = {
        fundId: "6401acb2-94a1-4d0d-9fa4-8f62743b4cd6",
        amount: 100000,
      };
      let response = await request(app)
        .post("/transactions/buy")
        .set("Authorization", `Bearer ${access_token}`)
        .send(body);

      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "There are no Mutual Funds with that ID!"
      );
    });

    it("invalid data type Fund Id", async () => {
      const body = {
        fundId: "1",
        amount: 100000,
      };
      let response = await request(app)
        .post("/transactions/buy")
        .set("Authorization", `Bearer ${access_token}`)
        .send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Invalid Data Type");
    });

    it("Has not login, should return an object with authentication error message", async () => {
      const body = {
        fundId: "1",
        amount: 100000,
      };
      let response = await request(app).post("/transactions/buy").send(body);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Authentication Error, please login first!"
      );
    });

    it("invalid token, should return an object with authentication error message", async () => {
      const body = {
        fundId: "1",
        amount: 100000,
      };
      let response = await request(app)
        .post("/transactions/buy")
        .set("Authorization", `Bearer invalid`)
        .send(body);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Authentication Error, invalid token"
      );
    });
  });
});

// TRANSACTIONS LIST
describe("GET /transactions", () => {
  describe("GET /funds - succeed", () => {
    it("should an array of transactions if any", async () => {
      let response = await request(app)
        .get("/transactions")
        .set("Authorization", `Bearer ${access_token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
    });
  });
});

// SELL;
describe("post /transactions/sell", () => {
  describe("post /transactions/sell - succeed", () => {
    it("should create new transaction and success message", async () => {
      let fund = await request(app)
        .get("/funds")
        .set("Authorization", `Bearer ${access_token}`);

      let fundId = fund.body.funds[0].id;
      await request(app)
        .post("/transactions/buy")
        .set("Authorization", `Bearer ${access_token}`)
        .send({
          fundId,
          amount: 20000,
        });

      let investment = await request(app)
        .get("/investments")
        .set("Authorization", `Bearer ${access_token}`);
      let investmentId = investment.body.investment[0].id;
      const body = {
        investmentId,
        unit: 20,
      };
      let response = await request(app)
        .post("/transactions/sell")
        .set("Authorization", `Bearer ${access_token}`)
        .send(body);

      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe("POST /transactions/sell - error", () => {
    it("invalid unit", async () => {
      let fund = await request(app)
        .get("/funds")
        .set("Authorization", `Bearer ${access_token}`);

      let fundId = fund.body.funds[0].id;
      await request(app)
        .post("/transactions/buy")
        .set("Authorization", `Bearer ${access_token}`)
        .send({
          fundId,
          amount: 100000,
        });

      let investment = await request(app)
        .get("/investments")
        .set("Authorization", `Bearer ${access_token}`);
      let investmentId = investment.body.investment[0].id;
      const body = {
        investmentId,
        unit: 9999999999999,
      };
      let response = await request(app)
        .post("/transactions/sell")
        .set("Authorization", `Bearer ${access_token}`)
        .send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Transaction is Invalid! Please check the inputs are correct!"
      );
    });
    it("Has not login, should return an object with authentication error message", async () => {
      const body = {
        fundId: "1",
        amount: 100000,
      };
      let response = await request(app).post("/transactions/sell").send(body);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Authentication Error, please login first!"
      );
    });

    it("invalid token, should return an object with authentication error message", async () => {
      const body = {
        fundId: "1",
        amount: 100000,
      };
      let response = await request(app)
        .post("/transactions/sell")
        .set("Authorization", `Bearer invalid`)
        .send(body);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Authentication Error, invalid token"
      );
    });
  });
});

// SWITCH;
describe("post /transactions/switch", () => {
  describe("post /transactions/switch - succeed", () => {
    it("should create new transaction and success message", async () => {
      let fund = await request(app)
        .get("/funds")
        .set("Authorization", `Bearer ${access_token}`);

      let fundId = fund.body.funds[0].id;
      await request(app)
        .post("/transactions/buy")
        .set("Authorization", `Bearer ${access_token}`)
        .send({
          fundId,
          amount: 100000,
        });

      let investment = await request(app)
        .get("/investments")
        .set("Authorization", `Bearer ${access_token}`);
      let investmentId = investment.body.investment[0].id;
      const body = {
        investmentId,
        switchFundId: fund.body.funds[1].id,
        unit: 20,
      };
      let response = await request(app)
        .post("/transactions/switch")
        .set("Authorization", `Bearer ${access_token}`)
        .send(body);

      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe("POST /transactions/switch - error", () => {
    it("Different Investment Manager, shows error message", async () => {
      let fund = await request(app)
        .get("/funds")
        .set("Authorization", `Bearer ${access_token}`);

      let fundId = fund.body.funds[0].id;
      await request(app)
        .post("/transactions/buy")
        .set("Authorization", `Bearer ${access_token}`)
        .send({
          fundId,
          amount: 100000,
        });

      let investment = await request(app)
        .get("/investments")
        .set("Authorization", `Bearer ${access_token}`);
      let investmentId = investment.body.investment[0].id;
      const body = {
        investmentId,
        switchFundId: fund.body.funds[4].id,
        unit: 20,
      };
      let response = await request(app)
        .post("/transactions/switch")
        .set("Authorization", `Bearer ${access_token}`)
        .send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "You can't switch to a different manager's fund!"
      );
    });
    it("invalid unit", async () => {
      let fund = await request(app)
        .get("/funds")
        .set("Authorization", `Bearer ${access_token}`);

      let fundId = fund.body.funds[0].id;
      await request(app)
        .post("/transactions/buy")
        .set("Authorization", `Bearer ${access_token}`)
        .send({
          fundId,
          amount: 100000,
        });

      let investment = await request(app)
        .get("/investments")
        .set("Authorization", `Bearer ${access_token}`);
      let investmentId = investment.body.investment[0].id;
      const body = {
        investmentId,
        unit: 9999999999999,
      };
      let response = await request(app)
        .post("/transactions/switch")
        .set("Authorization", `Bearer ${access_token}`)
        .send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Transaction is Invalid! Please check the inputs are correct!"
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
