const router = require("express").Router();
const authorization = require("../middlewares/authorization");
const transactionController = require("../controllers/transactionController");

router.get("/", transactionController.transactionList);
router.post("/buy", transactionController.buy);
router.post("/sell", authorization, transactionController.sell);
router.post("/switch", authorization, transactionController.switch);

module.exports = router;
