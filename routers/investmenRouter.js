const router = require("express").Router();
const investmentController = require("../controllers/investmentController");

router.get("/", investmentController.myInvestments);

module.exports = router;
