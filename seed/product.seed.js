const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
require("./../config/dbConnect");

const User = require("./../models/User.model");
const Product = require("./../models/Product.model");
const Order = require("./../models/Order.model");
const Comment = require("./../models/Comment.model");
const password = "password";
const bcrypt = require("bcryptjs");

const hashedPassword = bcrypt.hashSync(password, 12);

const user1 = {
  name: "Tina",
  email: "jdks@mail.com",
  password: hashedPassword,
};

seed();

async function seed() {
  try {
    await User.deleteMany();
    const createdUser = await User.create(user1);
    const allProducts = await Product.find();

    const completedOrder = {
      userId: createdUser._id,
      status: "completed",
      products: [
        {
          productId: allProducts[0]._id,
          quantity: 2,
        },
        {
          productId: allProducts[1]._id,
          quantity: 1,
        },
        {
          productId: allProducts[2]._id,
          quantity: 6,
        },
      ],
    };
    const pendingOrder = {
      userId: createdUser._id,
      products: [
        {
          productId: allProducts[6]._id,
          quantity: 4,
        },
        {
          productId: allProducts[5]._id,
          quantity: 1,
        },
        {
          productId: allProducts[8]._id,
          quantity: 3,
        },
      ],
    };
    await Order.create([pendingOrder, completedOrder]);
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
}
