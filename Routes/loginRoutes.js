const express = require("express");
const router = express.Router();
const LogInController = require("../Controllers/LogInController");

router.route("/").post(LogInController.login);

module.exports = router;
