const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ExamSchema = Schema({
  name_exam: { type: String, required: true },
  description: { type: String, required: true , default: " "},
  quiz: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
  create_at: { type: Date, required: true, default: new Date().getTime() },
  update_at: { type: Date, required: true, default: new Date().getTime() },
  disable: { type: Boolean, required: true, default: false },
  id: { type: String, required: true },
});

const Exam = mongoose.model("Exam", ExamSchema);

module.exports = { ExamSchema, Exam };
