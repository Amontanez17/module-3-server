const router = require("express").Router();

router.use("/orders", require("./orders.routes.js"));
router.use("/products", require("./product.routes.js"));

module.exports = router;
