// server/routes/gameRoutes.js
const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

router.post("/bet", gameController.bet);
router.get("/history", gameController.getUserHistory);
router.post("/withdraw", gameController.withdraw);
router.post("/reset", gameController.reset);

module.exports = router;
