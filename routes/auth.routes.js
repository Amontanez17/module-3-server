const bcrypt = require("bcryptjs");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuth } = require("../middleware/jwt.middleware");

const SALT = 12;

// SIGN UP
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (email === "" || password === "" || name === "") {
      res.status(400).json({ message: "invalid entry" });
      return;
    }

    const foundUser = await User.findOne({ email });

    if (foundUser) {
      res.status(400).json({ message: "user already exists" });
    }

    const salt = 12;

    hashedPassword = bcrypt.hashSync(password, salt);
    const createdUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const { newEmail, newName, _id } = createdUser;
    const user = { newName, newEmail, _id };
    res.status(201).json({ user: user });
  } catch (error) {
    next(error);
  }
});

// LOGIN
router.post("/login", async (req, res, next) => {
  console.log("Im here");
  try {
    const { email, password } = req.body;
    console.log(password);
    if (!email || !password) {
      return res.status(400).json({ message: "this doesn't exist" });
    }

    const foundUser = await User.findOne({ email }, { email: 1, password: 1 });
    if (!foundUser) {
      return res.status(400).json({ message: "wrong credentials" });
    }

    console.log("right before bcrypt");
    const correctPassword = await bcrypt.compare(password, foundUser.password);
    if (!correctPassword) {
      return res.status(401).json({ message: "wrong credentials" });
    }

    const payload = { id: foundUser._id };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
      algorithm: "HS256",
    });

    res.json({ authToken: token });
  } catch (error) {
    next(error);
  }
});

router.get("/verify", isAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
