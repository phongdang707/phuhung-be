const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AttendanceSchema = Schema({
  id_course: { type: Schema.Types.ObjectId, ref: 'Course' },
  students: [{ type: Schema.Types.ObjectId, ref: "User" }],
  create_at: { type: Date, required: true, default: new Date().getTime() },
  update_at: { type: Date, required: true, default: new Date().getTime() },
  disable: { type: Boolean, required: true, default: false },
  id: { type: String, required: true },
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

module.exports = { AttendanceSchema, Attendance };
