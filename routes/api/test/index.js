const express = require("express");
const testController = require("./test");
const { authenticating, authorizing } = require("../../../middlewares/auth");
const { checkStudentInTest } = require("../../../validation/validateTest");
const router = express.Router();

router.post("/newTest",authenticating, authorizing(["admin"]), testController.newTest);
router.post("/getDetailStudentTest", authenticating, authorizing(["student"]), checkStudentInTest, testController.getDetailTest);
router.post("/changeStatusTest",authenticating, authorizing(["admin"]), testController.changeStatusTest);

module.exports = router;
