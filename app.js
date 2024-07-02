require("dotenv").config();
require("./config/dbConnect.js");
const express = require("express");
// (bodyParser = require("body-parser")),
//   (swaggerJsdoc = require("swagger-jsdoc")),
//   (swaggerUi = require("swagger-ui-express"));
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

app.use("/auth", require("./routes/auth.routes.js"));

app.use("/api", require("./routes/index.routes.js"));

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.use(notFoundHandler);
app.use(errorHandler);
// START SERVER

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "LogRocket Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

// const specs = swaggerJsdoc(options);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
