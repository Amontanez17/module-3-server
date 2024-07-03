require("dotenv").config();
require("./config/dbConnect.js");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { errorHandler, notFoundHandler } = require("./error/error-handling.js");
const PORT = process.env.PORT || 5005;
// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
app.use(
  cors({
    origin: [process.env.FRONTEND_DEV, process.env.FRONTEND_PROD], // add more if necessary
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  res.json("All good here!");
});

app.use("/auth", require("./routes/auth.routes.js"));

app.use("/api", require("./routes/index.routes.js"));

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.use(notFoundHandler);
app.use(errorHandler);
// START SERVER

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
