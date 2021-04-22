const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ContentSchema = Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  link_file: { type: String, required: false },
  create_at: { type: Date, required: true, default: new Date().getTime() },
  update_at: { type: Date, required: true, default: new Date().getTime() },
  disable: { type: Boolean, required: true, default: false },
  id: { type: String, required: true },
});

const Content = mongoose.model("Content", ContentSchema);

module.exports = { ContentSchema, Content };
