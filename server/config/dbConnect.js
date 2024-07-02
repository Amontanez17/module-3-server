const mongoose = require("mongoose");

const DB_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cohort-tools-api";
// IIFE Immediately Invoked Function Execution
(async function () {
  try {
    const db = await mongoose.connect(DB_URI);
    console.log(`Connected to Database: "${db.connection.name}"`);
  } catch (error) {
    console.log(error);
  }
})();
