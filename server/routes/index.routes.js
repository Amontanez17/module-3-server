const router = require("express").Router();

router.use("/cohorts", require("./cohorts.routes.js"));
router.use("/students", require("./students.routes.js"));

module.exports = router;
