// models/category.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  picture: String,
});

module.exports = mongoose.model("Category", categorySchema);
