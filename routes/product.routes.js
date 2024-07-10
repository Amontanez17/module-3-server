const { isAuth } = require("../middleware/jwt.middleware");
const Product = require("../models/Product.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");
const router = require("express").Router();

// GET ALL PRODUCTS ROUTE

router.get("/", async (req, res, next) => {
  const query = {};
  const { title, category, rating } = req.query;
  if (title) {
    query.title = new RegExp(title, "i");
  }
  if (rating) {
    query["rating.rate"] = { $gte: Number(rating) };
    // query.rating = { rate: { $gte: Number(rating) } };
  }
  if (category) {
    query.category = new RegExp(category, "i");
  }
  try {
    console.log(query);
    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// GET ONE PRODUCT ROUTE

router.get("/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    const oneProduct = await Product.findOne({ _id: productId });
    const comments = await Comment.find({ productId })
      .sort({ createdAt: -1 })
      .populate("creator");
    console.log("Retrieved product ->", oneProduct);
    res.json({ product: oneProduct, comments });
  } catch (error) {
    next(error);
  }
});

// ROUTE TO ADD A COMMENT ON A PRODUCT

router.post("/:productId/comment", isAuth, async (req, res, next) => {
  try {
    const { id } = req.payload;
    const { text, rating } = req.body;
    const { productId } = req.params;

    // Create a new comment object
    const newComment = new Comment({
      productId: productId,
      creator: id,
      text,
      rating: rating,
    });

    // Save the new comment to the database
    const createdComment = await newComment.save();
    res.status(201).json(createdComment);
  } catch (error) {
    next(error);
  }
});

// GET ALL PRODUCTS FROM A CERTAIN CATEGORY

router.get("/product/:productCategory", isAuth, async (req, res, next) => {
  try {
    const { category } = req.params;
    const productCategory = await Product.find({
      productCategory: category,
    }).populate("product");
    res.status(200).json(productCategory);
  } catch (error) {
    next(error);
  }
});

// GET COMMENTS ON A SINGLE PRODUCT

// router.get("/:productId", async (req, res, next) => {
//   try {
//     const { productId } = req.params;
//     const oneProduct = await Product.findOne({ _id: productId });
//     console.log("Retrieved cohorts ->", oneProduct);
//     res.json(oneProduct);
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
