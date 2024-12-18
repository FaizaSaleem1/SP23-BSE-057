const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },

  price: { type: Number, required: true },
  description: { type: String, required: true },
  picture: String,
 

});

module.exports = mongoose.model("Product", productSchema);
