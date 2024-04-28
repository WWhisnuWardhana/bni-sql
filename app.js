require("dotenv").config();
const express = require("express");
const app = express();
const routers = require("./routers/index");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(routers);
app.use(errorHandler);

module.exports = app;
