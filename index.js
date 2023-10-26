const express = require("express");
const app = express();
const errorHandler = require("express-async-error").Handler;
require("dotenv").config();

const cors = require("cors");
// DB connection
require("./db");

//Requiring Routes
const usersRouter = require("./src/routes/usersRoutes");

const verifyToken = require("./src/utils/verifyToken");

// parsing incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// error handler over any async function
app.use(errorHandler());

// Routes
app.use("/users", usersRouter);

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).send({
    status: statusCode,
    message: err?.message || "Internal Server Error!",
    errors: err?.errors || [],
  });
});

app.listen(+process.env.PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " +
        +process.env.PORT
    );
  else console.log("Error occurred, server can't start", error);
});
