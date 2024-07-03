const { isAuth } = require("../middleware/jwt.middleware");
const Product = require("../models/Product.model");
const User = require("../models/User.model");
const router = require("express").Router();

//ROUTE TO ADD A COMMENT ON A PRODUCT

router.post("/:productId/comment", isAuth, async (req, res, next) => {
  try {
    const { userId } = req.payload;
    const { content, rating } = req.body;
    const { productId } = req.params;

    // Create a new comment object
    const newComment = new Comment({
      productId: productId,
      userId: userId,
      comment: content,
      rating: rating,
    });

    // Save the new comment to the database
    const createdComment = await newComment.save();
    res.status(201).json(createdComment);
  } catch (error) {
    next(error);
  }
});

// ROUTE TO UPDATE COMMENTS

router.put("/userId/comments/:commentId", isAuth, async (req, res, next) => {});
