/**
 * SCHEMA SETUP
 */
const myDB = require("./connection"); // TODO is this liune necessary?
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const { Schema } = mongoose;
const issueSchema = new Schema({
  project: { type: String, required: true },
  assigned_to: { type: String, required: false },
  status_text: { type: String, required: false },
  open: { type: Boolean, default: true },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
});
const Issue = mongoose.model("Issue", issueSchema);

module.exports = { Issue };
