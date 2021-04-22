const express = require("express");
const quizController = require("./quiz");
const { authenticating, authorizing } = require("../../../middlewares/auth");
const router = express.Router();

router.post("/getQuizById", quizController.getQuizById);
router.post("/newQuiz",authenticating, authorizing(["admin"]), quizController.newQuiz);
router.post("/editQuiz",authenticating, authorizing(["admin"]), quizController.editQuiz);
router.post("/deleteQuiz",authenticating, authorizing(["admin"]), quizController.deleteQuiz);
module.exports = router;
