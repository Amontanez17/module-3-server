const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ["men's clothing", "women's clothing", "electronics", "jewelry"],
  },
  image: { type: String, default: "https://imgur.com/QkIa5tT" },
});

const Product = mongoose.model("Product", productSchema); //creating a Model
module.exports = Product; //Exporting the created module.
