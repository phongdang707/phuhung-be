const { Exam } = require("../../../models/exams");
const { Quiz } = require("../../../models/quiz");
const { v4: uuidv4 } = require("uuid");
const ObjectId = require("mongodb").ObjectID;

const getQuizById = (req, res, next) => {
  const { id } = req.body;
  Exam.
    findOne({ _id: ObjectId(id) }).
    populate({
        path: 'quiz',
        match: {disable:false}
    }).
    exec(function (err, course) {
      if (err) return res.send({ code: 500, type: err });
      res.send({ code: 200 ,data:course});
    });
};

const newQuiz = (req, res, next) => {
  const { id, question, answer_a, answer_b, answer_c, answer_d, correct_answer ,solution, time } = req.body;
  const id_a = uuidv4();
  const id_b = uuidv4();
  const id_c = uuidv4();
  const id_d = uuidv4();
  var correct = "";
  switch (correct_answer) {
    case "answer_a":
      correct = id_a;
      break;
    case "answer_b":
      correct = id_b;
      break;
    case "answer_c":
      correct = id_c;
      break;
    case "answer_d":
      correct = id_d;
      break;
    default:
      break;
  }
  const newQuiz = new Quiz({
    question:question,
    answer_a:{text:answer_a,id:id_a},
    answer_b:{text:answer_b,id:id_b},
    answer_c:{text:answer_c,id:id_c},
    answer_d:{text:answer_d,id:id_d},
    correct_answer:{text:correct_answer,id:correct},
    solution:solution,
    create_at: time,
    update_at:time,
    id: uuidv4(),
  });
  newQuiz
    .save()
    .then((quiz) => {
      Exam.findByIdAndUpdate({ _id: ObjectId(id)}, { $push: { quiz: quiz._id } }, {useFindAndModify: false}).exec();
      res.send({ code: 200, type: "success" }) // success
    }) // success
    .catch((err) => res.send({ code: 500, type: err })); // err
};

const editQuiz = (req, res, next) => {
  const { id, id_question,question, answer_a, answer_b, answer_c, answer_d, correct_answer, solution,time } = req.body;
  Quiz.findOne({ _id: ObjectId(id_question) })
    .then((exam) => {
      var correct = "";
      switch (correct_answer) {
        case "answer_a":
          correct = exam.answer_a.id;
          break;
        case "answer_b":
          correct = exam.answer_b.id;
          break;
        case "answer_c":
          correct = exam.answer_c.id;
          break;
        case "answer_d":
          correct = exam.answer_d.id;
          break;
        default:
          break;
      }
      exam.question = question;
      exam.answer_a.text =  answer_a ;
      exam.answer_b.text =  answer_b ;
      exam.answer_c.text =  answer_c ;
      exam.answer_d.text =  answer_d ;
      exam.correct_answer = {text:correct_answer,id:correct};
      exam.update_at  = time;
      exam.solution = solution;
      exam.markModified('question')
      exam.markModified('answer_a')
      exam.markModified('answer_b')
      exam.markModified('answer_c')
      exam.markModified('answer_d')
      exam.markModified('correct_answer')
      exam.markModified('update_at')
      exam.markModified('solution')
      exam.save()
        .then((quiz) => {
          res.send({ code: 200, type: "success" }) // success
        }) // success
        .catch((err) => res.send({ code: 500, type: err })); // err
    })
    .catch((err) => res.send({ code: 500, type: err })); // err
};

const deleteQuiz = (req, res, next) => {
  const { id ,id_exam , time } = req.body;
  Quiz.findOne({ _id: ObjectId(id) })
   .then((quiz) => {
     Exam.findByIdAndUpdate({ _id: ObjectId(id_exam)}, { $pull: { quiz: id }}, {useFindAndModify: false}).exec();
     Quiz.findByIdAndUpdate({ _id: ObjectId(id)},{ $set: { disable: true, update_at: time } }, {useFindAndModify: false}).exec();
     res.send({ code: 200, type: "success" }) // success
  })
  .catch((err) => res.send({ code: 500, type: err }));
};

module.exports = {
  getQuizById,
  newQuiz,
  editQuiz,
  deleteQuiz
};
