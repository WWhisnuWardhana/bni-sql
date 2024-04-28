const router = require("express").Router();
const fundRouter = require("./fundRouter");
const transactionRouter = require("./transactionRouter");
const investmentRouter = require("./investmenRouter");

const authentication = require("../middlewares/authentication");
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);

router.use(authentication);
router.patch("/topup", userController.topup);
router.use("/funds", fundRouter);
router.use("/transactions", transactionRouter);
router.use("/investments", investmentRouter);

module.exports = router;
