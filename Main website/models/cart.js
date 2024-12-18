
const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
  });
  
  const Cart = mongoose.model("Cart", cartSchema);
  
  module.exports = Cart;
  