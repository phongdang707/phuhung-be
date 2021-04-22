const { Course } = require("../../../models/courses");
const { Test } = require("../../../models/test");
const { v4: uuidv4 } = require("uuid");
const ObjectId = require("mongodb").ObjectID;

const newTest = (req, res, next) => {
  const { id, exam_id, number_quiz, exam_time ,name_exam , time} = req.body;
  const newTest = new Test({
    id_exam:exam_id,
    id_course: id,
    quiz_number:number_quiz,
    time:exam_time,
    name_exam: name_exam,
    id: uuidv4(),
    create_at:time,
    update_at:time,
  });
  newTest
    .save()
    .then((test) => {
      Course.findByIdAndUpdate({ _id: ObjectId(id)}, { $push: { exams: test._id } }, {useFindAndModify: false}).exec();
      res.send({ code: 200, type: "success" })
    }) // success
    .catch((err) => res.send({ code: 500, type: err })); // err
};

const getDetailTest = (req, res, next) => {
  const { id } = req.body;
  Test.findOne({ _id: ObjectId(id) })
    .populate({
        path: 'result',
        populate : {
          path : 'quiz'
        },
        match: {disable:false}
    })
    .then((test) => {
        let studentData = null;
        test.result.map(item=>{
          if(item.id_student == req.user_info.payload.id)
            studentData = item ;
            return;
        })
        test.result = undefined;
        res.send({ code: 200, data:test , studentData:studentData});
    })
    .catch((err) => res.send({ code: 500, type: err })); // err
};

const changeStatusTest = (req, res, next) => {
  const {id} = req.body;
  Test.findOne({ _id: ObjectId(id) })
    .then((test) => {
      Test.findByIdAndUpdate(
        { _id: ObjectId(id) },
        { $set: { openTest : !test.openTest} },
        { useFindAndModify: false }
      ).exec();
      res.send({ code: 200, type: "success" });
    })
    .catch((err) => res.send({ code: 500, type: err })); // err
};

module.exports = {
  newTest,
  getDetailTest,
  changeStatusTest
};
