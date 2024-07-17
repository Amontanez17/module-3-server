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
      const existingProduct = existingOrder.products.find(
        (product) => product.productId.id === req.params.productId
      );

      if (!existingProduct) {
        existingOrder.products.push({
          productId: req.params.productId,
          quantity: req.body.quantity || 1,
        });
      } else {
        existingOrder.products.forEach((product) => {
          if (product.productId.id === req.params.productId) {
            product.quantity++;
          }
        });
      }
      await existingOrder.populate("products.productId");
      await existingOrder.save();
      console.dir(existingOrder);
      res.status(200).json(existingOrder);
    } else {
      const newOrder = new Order({
        userId: req.payload.id,
        status: "pending",
        products: [
          { productId: req.params.productId, quantity: req.body.quantity || 1 },
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
    let existingOrder = await Order.findOneAndUpdate(
      {
        userId: req.payload.id,
        status: "pending",
      },
      {
        $pull: { products: { productId: req.params.productId, quantity: 1 } },
      },
      { new: true }
    ).populate("products.productId");

    existingOrder = await Order.findOne({
      userId: req.payload.id,
      status: "pending",
    });
    for (const product of existingOrder.products) {
      if (String(product.productId) === req.params.productId) {
        product.quantity--;
      }
    }
    await existingOrder.save();
    await existingOrder.populate("products.productId");
    res.status(200).json(existingOrder);
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
    ).populate("products.productId");
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
