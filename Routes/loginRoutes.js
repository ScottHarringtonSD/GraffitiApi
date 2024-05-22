const express = require("express");
const router = express.Router();
const LogInController = require("../Controllers/LogInController");

router.route("/").post(LogInController.login);
router.route("/:token").get(LogInController.tokenAuth);

module.exports = router;
