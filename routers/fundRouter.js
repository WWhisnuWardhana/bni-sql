const router = require("express").Router();
const fundController = require("../controllers/fundController");

router.get("/", fundController.fundList);
router.get("/:id", fundController.findById);
router.post("/", fundController.createFund);
router.get("/filter/:manager", fundController.findByManager);

module.exports = router;
