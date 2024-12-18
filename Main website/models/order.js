const mongoose = require("mongoose");

const orderModelSchema = new mongoose.Schema({
    customerInfo: {
        name: String,
        street: String,
        city: String,
        postal_code: String,
        email: String,
        phone: String,
    },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    total: Number,
    orderDate: { type: Date, default: Date.now },
});

 module.exports = mongoose.model("order",orderModelSchema);
