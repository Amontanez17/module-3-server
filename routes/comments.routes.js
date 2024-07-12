const { isAuth } = require("../middleware/jwt.middleware");
const Product = require("../models/Product.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");
const router = require("express").Router();

// ROUTE TO UPDATE COMMENTS

router.put("/:commentId/update", isAuth, async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { id } = req.payload;
    const { text, rating } = req.body;
    const commentToUpdate = { text, rating };
    let updatedComment;

    // Find and update

    if (req.isAuth) {
      updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        commentToUpdate,
        {
          new: true,
        }
      );
    } else {
      updatedComment = await Comment.findOneAndUpdate(
        { _id: commentId, creator: id },
        commentToUpdate,
        { new: true }
      );
    }

    if (!updatedComment) {
      return res.status(401).json({ message: "Denied" });
    }

    res.status(202).json(updatedComment);
  } catch (error) {
    next(error);
  }
});

// ROUTE TO DELETE COMMENTS

router.delete("/:commentId/delete", isAuth, async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { id } = req.payload;
    await Comment.findOneAndDelete({
      _id: commentId,
      creator: id,
    });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
