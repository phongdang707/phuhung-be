const express = require("express");
const teacherController = require("./teacher");
const { authenticating, authorizing } = require("../../../middlewares/auth");
const { validateUser } = require("../../../validation/validateUser");

const router = express.Router();

router.get(
  "/getTeacherDashboard",
  authenticating,
  authorizing("teacher"),
  teacherController.getStudentDashboard
);
router.get(
  "/getTeacherListByNameAndId",
  teacherController.getTeacherListByNameAndId
);
router.post("/register", validateUser(), teacherController.register);

router.post("/getTeacherAll", teacherController.getTeacherAll);

module.exports = router;
