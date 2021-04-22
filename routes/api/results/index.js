const express = require("express");
const resultController = require("./result");
const { authenticating, authorizing } = require("../../../middlewares/auth");
const router = express.Router();

router.post("/newResult",authenticating, authorizing(["student"]), resultController.newResult);
router.post("/getQuizTest",authenticating, authorizing(["student"]), resultController.getQuizTest);
router.post("/submitTest",authenticating, authorizing(["student"]), resultController.submitTest);
router.post("/getResultTest",authenticating, authorizing(["admin"]), resultController.getResultTest);
router.post("/getResult",authenticating, authorizing(["student"]), resultController.getResult);

router.post("/removeResult",authenticating, authorizing(["admin"]), resultController.removeResult);
module.exports = router;
