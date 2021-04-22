const express = require("express");
const examsController = require("./exams");
const { authenticating, authorizing } = require("../../../middlewares/auth");
const { validateAddExam } = require("../../../validation/validateExams");
const router = express.Router();

router.post("/getAllExam",authenticating, authorizing(["admin"]), examsController.getAllExam);
router.post("/newExam",authenticating, authorizing(["admin"]), validateAddExam() ,  examsController.newExam);
router.post("/editExam",authenticating, authorizing(["admin"]), validateAddExam(), examsController.editExam);
router.post("/getExamById",authenticating, authorizing(["admin"]), examsController.getExamById);
router.post("/deleteExam",authenticating, authorizing(["admin"]), examsController.deleteExam);

module.exports = router;
