const request = require("supertest"); // seperti axios
const app = require("../app");
const { createToken } = require("../helpers/jwt");
const { sequelize } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const ramdomNum = require("../helpers/randomizer");

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

// LOGIN
describe("POST /login", () => {
  describe("POST /login - succeed", () => {
    it("should return an object with access token", async () => {
      const body = {
        username: "wahyu",
        password: "12345",
      };
      let response = await request(app).post("/login").send(body);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
    });
  });

  describe("POST /login - error", () => {
    it("empty username, should return an object with error message", async () => {
      const body = {
        username: "",
        password: "12345",
      };
      let response = await request(app).post("/login").send(body);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Username is required!");
    });

    it("empty password, should be return an object with error message", async () => {
      const body = {
        username: "wahyu",
        password: "",
      };
      let response = await request(app).post("/login").send(body);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Password is required!");
    });

    it("unregistered username, should be return an object with error message", async () => {
      const body = {
        username: "johntor",
        password: "12345",
      };
      let response = await request(app).post("/login").send(body);
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Username not found");
    });

    it("wrong pasword, should be return an object with error message", async () => {
      const body = {
        username: "wahyu",
        password: "123456",
      };
      let response = await request(app).post("/login").send(body);
      expect(response.status).toBe(401);
      console.log(response.error, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Invalid Username or Password"
      );
    });
  });
});

// ADD-USER
describe("POST /register", () => {
  describe("POST /register - succeed", () => {
    it("should return an object new user", async () => {
      const body = {
        username: "zzz",
        password: "12345",
      };
      let response = await request(app).post("/register").send(body);
      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("newUser", expect.any(Object));
    });
  });

  describe("POST /register - error", () => {
    it("null username, should return an object validation error", async () => {
      const body = {
        username: null,
        password: "sinta",
      };
      let response = await request(app).post("/register").send(body);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Username can't be null");
    });

    it("null password, should return an object validation error", async () => {
      const body = {
        username: "aaa",
        password: null,
      };
      let response = await request(app).post("/register").send(body);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Password can't be null");
    });

    it("empty username, should return an object validation error", async () => {
      const body = {
        username: "",
        password: "12345",
      };
      let response = await request(app).post("/register").send(body);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Username can't be empty"
      );
    });

    it("empty password, should return an object validation error", async () => {
      const body = {
        username: "ccc",
        password: "",
      };
      let response = await request(app).post("/register").send(body);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Password can't be empty"
      );
    });

    it("password length is less than 5, should return an object validation error", async () => {
      const body = {
        username: "ddd",
        password: "1234",
      };
      let response = await request(app).post("/register").send(body);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Minimal password length is 5!"
      );
    });

    it("duplicate username, should return an object validation error", async () => {
      const body = {
        username: "wahyu",
        password: "12345",
      };
      let response = await request(app).post("/register").send(body);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Username is already taken"
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
