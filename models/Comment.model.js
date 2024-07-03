const mongoose = require("mongoose");
const { Schema } = mongoose;

//Mongoose Schemas
const commentSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference to the Product model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  comment: {
    type: String,
  },
  rating: { type: Number, required: true },
});

//Export Mongoose models
const Comment = mongoose.model("Comment", commentSchema); //creating a Model
module.exports = Comment; //Exporting the created module.
