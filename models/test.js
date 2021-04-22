const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TestSchema = Schema({
  id_exam: { type: Schema.Types.ObjectId, ref: 'Exam' },
  id_course: { type: Schema.Types.ObjectId, ref: 'Course' },
  name_exam: { type: String, required: true },
  quiz_number: { type: Number, required: true },
  openTest: { type: Boolean, required: true, default: false },
  time: { type: Number, required: true },
  result: [{ type: Schema.Types.ObjectId, ref: 'Result' }],
  create_at: { type: Date, required: true, default: new Date().getTime() },
  update_at: { type: Date, required: true, default: new Date().getTime() },
  disable: { type: Boolean, required: true, default: false },
  id: { type: String, required: true },
});

const Test = mongoose.model("Test", TestSchema);

module.exports = { TestSchema, Test };
