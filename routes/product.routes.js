const { isAuth } = require("../middleware/jwt.middleware");
const Product = require("../models/Product.model");
const User = require("../models/User.model");
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
    const comments = await Comment.find({ productId }).populate(
      "user",
      "product"
    );
    console.log("Retrieved product ->", oneProduct);
    res.json({ oneProduct, comments });
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
