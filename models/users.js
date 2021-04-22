const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = Schema({
  email: { type: String, required: true },
  position: { type: String, required: false },
  division: { type: String, required: false },
  department: { type: String, required: false },
  user_name: { type: String, required: true },
  password: { type: String, required: true },
  location: { type: String, required: false },
  permission: { type: String, required: false },
  create_at: { type: Date, required: true, default: new Date().getTime() },
  update_at: { type: Date, required: true, default: new Date().getTime() },
  disable: { type: Boolean, required: true, default: false },
  id: { type: String, required: true },
  course: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  token: { type: String, required: false },
});

const User = mongoose.model("User", UserSchema);

module.exports = { UserSchema, User };
