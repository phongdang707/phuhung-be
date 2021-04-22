const { Exam } = require("../../../models/exams");
const { Course } = require("../../../models/courses");
const { Test } = require("../../../models/test");
const { v4: uuidv4 } = require("uuid");
const { body, validationResult } = require("express-validator");
const ObjectId = require("mongodb").ObjectID;


const newExam = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ code: 500, errors: errors.array() });
  }
  const { name_exam, description , time } = req.body;
  const newExam = new Exam({
    name_exam,
    description,
    create_at: time,
    update_at:time,
    id: uuidv4(),
  });
  newExam
    .save()
    .then((exam) => {
      res.send({ code: 200, data: exam._id});
    }) // success
    .catch((err) => res.send({ code: 500, type: err })); // err
};

const editExam = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ code: 500, errors: errors.array() });
  }
  const { name_exam, description , id ,time} = req.body;
  Exam.updateOne(
    { _id: ObjectId(id) },
    {
      $set: {
        name_exam: name_exam,
        description: description,
        update_at:time,
      },
    }
  )
    .then((exam) => {
      res.send({ code: 200, data: id});
    })
    .catch((err) => res.send({ code: 500, type: err })); // err
};

const getAllExam = (req, res, next) => {
  const { page, rowsPerPage, searchText } = req.body;
  Exam.find({ name_exam: { $regex: searchText } })
    .where("disable")
    .equals(false)
    .then((exam) => {
      let sendData = {
        data: exam
          .reverse()
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        length: exam.length,
      };
      res.send({ code: 200, data:sendData});
    })
    .catch((err) => res.send({ code: 500, type: err })); // err
};

const getExamById = (req, res, next) => {
  const { id } = req.body;
  Exam.findOne({ _id: ObjectId(id) })
    .then((exam) => {
        res.send({ code: 200, data:exam});
    })
    .catch((err) => res.send({ code: 500, type: err })); // err
};

const deleteExam = (req, res, next) => {
  const { selected ,time} = req.body;
  selected.map((select) => {
    Exam.findByIdAndUpdate(
      { _id: ObjectId(select) },
      { $set: { disable: true, update_at: time } },
      { useFindAndModify: false }
    ).exec();
    Test.find({ id_exam: select })
      .then((result) => {
        result.map((test) => {
          console.log(test.id_course);
          Course.findByIdAndUpdate(
            { _id: ObjectId(test.id_course) },
            { $pull: { exams: test._id } },
            { useFindAndModify: false }
          ).exec();
          Test.findByIdAndUpdate(
            { _id: ObjectId(test._id) },
            { $set: { disable: true, update_at: time } },
            { useFindAndModify: false }
          ).exec();
        })
      })
      .catch((err) => res.send({ code: 500, type: err }));
  });
   res.send({ code: 200, type: "success" });
};


module.exports = {
  newExam,
  editExam,
  getAllExam,
  getExamById,
  deleteExam
};
