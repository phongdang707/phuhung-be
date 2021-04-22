const { body, validationResult } = require("express-validator");
const { Course } = require("../models/courses");
const ObjectId = require("mongodb").ObjectID;

let validateAddCourse = () => {
  return [
    body("name_course").custom((value, { req }) => {
      return Course.findOne({ name_course: value })
        .where("disable")
        .equals(false)
        .then((course) => {
          if (course) {
            if (req.body.id == course._id) return;
            return Promise.reject("Tên khóa học bị trùng!");
          }
        });
    }),
  ];
};

const checkStudentInCourse = (req,res,next) => {
  const { id } = req.body;
  Course.findOne({ _id:  ObjectId(id) },{students:1,teacher:1, _id:0})
    .where("disable")
    .equals(false)
    .then((course) => {
      let check = false;
      console.log(course);
      course.students.map(item=> {
        if(item.toString() == req.user_info.payload.id.toString())
        check = true;
       })
       if(course.teacher.toString() == req.user_info.payload.id.toString()) check = true;
       check? next() : res.send({ code: 500, errors: "Học sinh không ở trong khóa học!" });
    })
    .catch((err) => res.send({ code: 500, errors: "Khóa học không tồn tại" })); // err
}

module.exports = { validateAddCourse , checkStudentInCourse};
