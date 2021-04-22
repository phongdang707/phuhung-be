const { Result } = require("../../../models/result");
const { Course } = require("../../../models/courses");
const { Test } = require("../../../models/test");
const { Exam } = require("../../../models/exams");
const { v4: uuidv4 } = require("uuid");
const ObjectId = require("mongodb").ObjectID;
const _ = require("lodash");

const newResult = (req,res,next) =>{
  const { id,create_at, quiz_number, time , id_exam} = req.body;
  Exam.findOne({ _id: ObjectId(id_exam) })
    .then((exam) => {
      const newResult = new Result({
        id_test:id,
        id_student:req.user_info.payload.id,
        quiz: _.sampleSize(exam.quiz, quiz_number),
        time: time,
        create_at:create_at,
        update_at:create_at,
        id: uuidv4(),
      });
      newResult
        .save()
        .then((result) => {
          Test.findByIdAndUpdate({ _id: ObjectId(id)}, { $push: { result: result._id } }, {useFindAndModify: false}).exec();
          res.send({ code: 200, data: result })
        }) // success
        .catch((err) => res.send({ code: 500, type: err })); // err
    })
    .catch((err) => res.send({ code: 500, type: err })); // err
};

const getQuizTest = (req, res, next) => {
  const { id } = req.body;
  Result.findOne({ _id: ObjectId(id) })
    .populate({
        path: 'quiz',
        match: {disable:false},
        select:{question:1, answer_a:1,answer_b:1,answer_c:1,answer_d:1}
    })
    .then((result) => {
      res.send({ code: 200, data:result });
    })
    .catch((err) => res.send({ code: 500, type: err })); // err
};

const submitTest = (req, res, next) => {
  const { id , answer , update_at } = req.body;
  Result.findOne({ _id: ObjectId(id) })
    .populate({
        path: 'quiz',
        match: {disable:false},
    })
    .then((result) => {
      if (!result.isDoing) {
        res.send({ code: 500, type: 'already submit' }); // err bắt khi nộp 2 lần
      }
      let correct = 0;
      for (var i = 0; i < answer.length; i++) {
        if(answer[i].answer == result.quiz[i].correct_answer.id )
          correct++;
      }
      const score = Math.round((correct / answer.length) * 100) / 10;
      Result.findByIdAndUpdate({ _id: ObjectId(id)}, {result:answer ,isDoing: false ,correct : `${correct}/${answer.length}`,score:score ,update_at: update_at }, {useFindAndModify: false}).exec();
      res.send({ code: 200, data: result.id_test });
    })
    .catch((err) => res.send({ code: 500, type: err })); // err
};

const getResultTest = (req, res, next) => {
  const { id,course, page, rowsPerPage} = req.body;
  Result.find({ id_test: ObjectId(id) })
    .where("disable")
    .equals(false)
    .populate({
        path: "id_student",
        match: { disable: false },
        select:{ user_name:1}
      })
    .select({isDoing:1,correct:1,create_at:1,time:1, id_student:1,score:1})
    .then((result) => {
      Course.findOne({  _id: ObjectId(course) })
        .populate({
            path: "students",
            match: { disable: false },
            select:{ user_name:1}
          })
       .select({_id:0,students:1})
       .then((user) => {
          var findArr = [];
          user.students.map((item,index)=>{
            let find = 0;
            for (var i = 0; i < result.length; i++) {
              if(item.user_name == result[i].id_student.user_name){
                find = 1;
                break;
              }
            }
            if(find == 0) findArr.push(item);
          })
           var arr = [];
           result.map(item=>
             arr.push({id:item.id_student._id, score: item.score})
           )
           let sendData = {
             data: result
               .reverse()
               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
             length: result.length,
             undone: findArr,
             stat: arr,
             total: user.students.length
           };
           res.send({ code: 200, data: sendData });
      })
    })
    .catch((err) => res.status(400).json(err));
};

const removeResult = (req, res, next) => {
  const {  selectRow} = req.body;
  Result.deleteOne({ _id: ObjectId(selectRow) })
  .exec();
  res.send({ code: 200, type: "success" });
};

const getResult = (req, res, next) => {
  const {  page, rowsPerPage} = req.body;
  Result.find({ id_student: ObjectId(req.user_info.payload.id) })
    .where("disable")
    .equals(false)
    .populate({
      path: "id_test",
      populate : {
        path : 'id_course',
        select:{name_course:1, _id:0}
      },
      match: { disable: false },
      select:{name_exam:1,id_course:1,quiz_number:1, _id:0}
    })
    .select({isDoing:1,correct:1,create_at:1,id_test:1,time:1,score:1})
    .then((user) => {
      let sendData = {
        data: user
          .reverse()
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        length: user.length,
      };
      res.send({ code: 200, data: sendData });
    })
    .catch((err) => res.status(400).json(err));
};

module.exports = {
  newResult,
  getQuizTest,
  submitTest,
  getResult,
  getResultTest,
  removeResult
};
