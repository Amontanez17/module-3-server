const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the Product model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
    // ... other product entries
  ],
  status: {
    type: String,
    enum: ["pending", "completed"], // Define allowed status values
    default: "pending", // Set a default status
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
