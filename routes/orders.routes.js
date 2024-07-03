const router = require("express").Router();
const { isAuth } = require("../middleware/jwt.middleware");
const Product = require("../models/Product.model");
const Order = require("../models/Order.model");
const User = require("../models/User.model");

// const isAuth = require("../middlewares/isAuthenticated");

// GET PENDING ORDERS ROUTE

router.get("/cart", isAuth, async (req, res, next) => {
  try {
    const order = await Order.findOne({
      userId: req.payload.id,
      status: "pending",
    }).populate("products.productId");
    console.log("Here is your order ->", order);
    res.json(order);
  } catch (error) {
    next(error);
  }
});

// GET PAST ORDERS ROUTE
router.get("/past", isAuth, async (req, res, next) => {
  try {
    const pastOrders = await Order.find({
      userId: req.payload.id,
      status: "completed",
    }).populate("products.productId");
    console.log("Here are your past orders ->", pastOrders);
    res.json(pastOrders);
  } catch (error) {
    next(error);
  }
});

// UPDATE THE CART OR CREATE A CART ROUTE
router.put("/add/:productId", isAuth, async (req, res, next) => {
  try {
    const existingOrder = await Order.findOne({
      userId: req.payload.id,
      status: "pending",
    }).populate("products.productId");
    console.log(existingOrder);
    if (existingOrder) {
      existingOrder.products.push({
        productId: req.params.productId,
        quantity: req.body.quantity,
      });
      await existingOrder.populate("products.productId");
      await existingOrder.save();
      console.dir(existingOrder);
      res.status(200).json(existingOrder);
    } else {
      const newOrder = new Order({
        userId: req.payload.id,
        status: "pending",
        products: [
          { productId: req.params.productId, quantity: req.body.quantity },
        ],
      });
      await newOrder.populate("products.productId");
      await newOrder.save();
      res.status(201).json(newOrder);
    }
  } catch (error) {
    next(error);
  }
});

// PUT REMOVE ITEM FROM THE CART ROUTE
router.put("/remove/:productId", isAuth, async (req, res, next) => {
  try {
    const existingOrder = await Order.findOneAndUpdate(
      {
        userId: req.payload.id,
        status: "pending",
      },

      { $pull: { products: { productId: req.params.productId } } },
      { new: true }
    ).populate("products.productId");

    if (existingOrder) {
      res.status(200).json(existingOrder);
    } else {
      res.status(400).json({ message: "Pending order not found" });
    }
  } catch (error) {
    next(error);
  }
});

// UPDATE ORDER STATUS ROUTE
router.patch("/:orderId/complete", isAuth, async (req, res, next) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: req.params.orderId,
        userId: req.payload.id,
        status: "pending",
      },
      { status: "completed" },
      { new: true }
    );
    console.log(updatedOrder);

    if (updatedOrder) {
      res.status(200).json(updatedOrder);
    } else {
      res
        .status(400)
        .json({ message: "Pending order not found or unauthorized" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
