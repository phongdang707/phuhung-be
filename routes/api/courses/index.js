const express = require("express");
const coursesController = require("./courses");
const { authenticating, authorizing } = require("../../../middlewares/auth");
const {
  validateAddCourse,
  checkStudentInCourse,
} = require("../../../validation/validateCourses");

const router = express.Router();

router.post(
  "/changeStatus",
  authenticating,
  authorizing(["admin"]),
  coursesController.changeStatus
);

router.post(
  "/addByExcel",
  authenticating,
  authorizing(["admin"]),
  coursesController.addByExcel
);
router.post(
  "/newCourse",
  authenticating,
  authorizing(["admin"]),
  validateAddCourse(),
  coursesController.newCourse
);
router.post(
  "/editCourse",
  authenticating,
  authorizing(["admin"]),
  validateAddCourse(),
  coursesController.editCourse
);
router.post("/getAllCourse", coursesController.getAllCourse);
router.post("/getCourseById", coursesController.getCourseById);
router.post(
  "/deleteCourse",
  authenticating,
  authorizing(["admin"]),
  coursesController.deleteCourse
);
router.post("/checkInfo", validateAddCourse(), coursesController.checkInfo);

router.post(
  "/getDetailCourseById",
  authenticating,
  authorizing(["admin"]),
  coursesController.getDetailCourseById
);
router.post(
  "/getDetailStudentCourse",
  authenticating,
  authorizing(["student", "teacher"]),
  checkStudentInCourse,
  coursesController.getDetailCourseStudent
);
router.post(
  "/getCourseAndTest",
  authenticating,
  authorizing(["admin"]),
  validateAddCourse(),
  coursesController.getCourseAndTest
);
router.post(
  "/getCourseAssign",
  authenticating,
  authorizing(["student"]),
  coursesController.getCourseAssign
);

router.post(
  "/assignCourse",
  authenticating,
  authorizing(["student"]),
  coursesController.assignCourse
);

module.exports = router;
