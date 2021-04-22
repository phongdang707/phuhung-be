const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const QuizSchema = Schema({
  question: { type: String, required: true },
  answer_a: { type: Object, required: true },
  answer_b: { type: Object, required: true },
  answer_c: { type: Object, required: true },
  answer_d: { type: Object, required: true },
  solution: { type: String, required: false ,default: "" },
  correct_answer: { type: Object, required: true },
  create_at: { type: Date, required: true, default: new Date().getTime() },
  update_at: { type: Date, required: true, default: new Date().getTime() },
  disable: { type: Boolean, required: true, default: false },
  id: { type: String, required: true },
});

const Quiz = mongoose.model("Quiz", QuizSchema);

module.exports = { QuizSchema, Quiz };
