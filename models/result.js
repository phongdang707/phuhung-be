const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ResultSchema = Schema({
  id_test: { type: Schema.Types.ObjectId, ref: 'Test' },
  id_student: { type: Schema.Types.ObjectId, ref: 'User' },
  quiz: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
  time: { type: Number, required: true },
  isDoing: { type: Boolean, required: true, default: true },
  result: { type: Array, required: true, default: [] },
  correct: { type: String, required: true, default: " " },
  score: { type: Number, required: true, default: -1 },
  create_at: { type: Date, required: true, default: new Date().getTime() },
  update_at: { type: Date, required: true, default: new Date().getTime() },
  disable: { type: Boolean, required: true, default: false },
  id: { type: String, required: true },
});

const Result = mongoose.model("Result", ResultSchema);

module.exports = { ResultSchema, Result };
