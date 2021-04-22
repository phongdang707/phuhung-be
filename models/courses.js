const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CourseSchema = Schema({
  name_course: { type: String, required: true },
  description: { type: String, required: false, default: "" },
  teacher: { type: Schema.Types.ObjectId, ref: "User" },
  location: { type: String, required: true },
  date: { type: String, required: true },
  require_course: { type: String, required: true , default: false },
  students: [{ type: Schema.Types.ObjectId, ref: "User" }],
  attendance: [{ type: Schema.Types.ObjectId, ref: "Attendance" }],
  contents: [{ type: Schema.Types.ObjectId, ref: "Content" }],
  status: { type: Boolean, required: true, default: true },
  exams: [{ type: Schema.Types.ObjectId, ref: "Test" }],
  create_at: { type: Date, required: true, default: new Date().getTime() },
  update_at: { type: Date, required: true, default: new Date().getTime() },
  disable: { type: Boolean, required: true, default: false },
  id: { type: String, required: true },
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = { CourseSchema, Course };
