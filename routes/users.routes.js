const { isAuth } = require("../middleware/jwt.middleware");
const Product = require("../models/Product.model");
const User = require("../models/User.model");
const router = require("express").Router();
