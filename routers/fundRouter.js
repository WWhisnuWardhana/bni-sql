const router = require("express").Router();
const fundController = require("../controllers/fundController");

router.get("/", fundController.fundList);
router.get("/:id", fundController.findById);

module.exports = router;
