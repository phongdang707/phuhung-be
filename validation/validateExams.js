const { body, validationResult } = require("express-validator");
const { Exam } = require("../models/exams");

let validateAddExam = () => {
  return [
    body("name_exam").custom((value, { req }) => {
      return Exam.findOne({ name_exam: value })
        .where("disable")
        .equals(false)
        .then((exam) => {
          if (exam) {
            if (req.body.id == exam._id) return;
            return Promise.reject("Tên bài kiểm tra bị trùng!");
          }
        });
    }),
  ];
};

module.exports = { validateAddExam };
