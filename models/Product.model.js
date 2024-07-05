const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  breweryName: { type: String },
  price: { type: String, required: true },
  description: { type: String },
  detailsType: {
    type: String,
  },
  detailsRegion: { type: String },
  abv: { type: String },
  image: { type: String, default: "https://imgur.com/QkIa5tT" },
});

const Product = mongoose.model("Product", productSchema); //creating a Model
module.exports = Product; //Exporting the created module.
