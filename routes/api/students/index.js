const express = require("express");
const studentsController = require("./students");
const { authenticating, authorizing } = require("../../../middlewares/auth");
const { validateUser } = require("../../../validation/validateUser");
const { uploadmulter } = require("../../../middlewares/uploadExcel");

const router = express.Router();
router.get(
  "/getStudentDashboard/",
  authenticating,
  authorizing("student"),
  studentsController.getStudentDashboard
);
router.post(
  "/getStudentById",
  authenticating,
  authorizing(["student", "admin"]),
  studentsController.getStudentById
);
router.post(
  "/getStudentByIdForAdmin",
  authenticating,
  authorizing("admin"),
  studentsController.getStudentByIdForAdmin
);
router.put(
  "/updateStudentById",
  authenticating,
  authorizing("admin"),
  studentsController.updateStudentById
);
router.put(
  "/updatePasswordStudentById",
  authenticating,
  authorizing("admin"),
  studentsController.updatePasswordStudentById
);
router.post(
  "/addByExcel",
  authenticating,
  authorizing("admin"),
  studentsController.addByExcel
);

router.post("/getStudent", studentsController.getStudent);
router.post("/register", validateUser(), studentsController.register);
router.post("/deleteStudent", studentsController.deleteStudent);
// router.post("/importExcel", uploadmulter, studentsController.importExcel);

module.exports = router;
