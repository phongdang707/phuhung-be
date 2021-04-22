const { body, validationResult } = require("express-validator");
const { Test } = require("../models/test");
const ObjectId = require("mongodb").ObjectID;

const checkStudentInTest = (req,res,next) => {
  const { id } = req.body;
  Test.findOne({ _id:  ObjectId(id) })
    .where("disable")
    .equals(false)
    .populate({
        path: 'id_course',
        match: {disable:false}
    })
    .then((test) => {
      let check = false;
      test.id_course.students.map(item=>{
        if(item == req.user_info.payload.id)
          check = true;
       })
       check? next(): res.send({ code: 500, errors: "Học sinh không ở trong khóa học!" });
    })
    .catch((err) => res.send({ code: 500, errors: "Khóa học không tồn tại" })); // err
}

module.exports = { checkStudentInTest };
