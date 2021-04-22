const express = require("express");
const attendanceController = require("./attendance");
const { authenticating, authorizing } = require("../../../middlewares/auth");
const router = express.Router();

router.post("/submit",authenticating, authorizing(["teacher"]), attendanceController.submit);
module.exports = router;
