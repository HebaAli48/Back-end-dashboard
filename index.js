const express = require("express");
const app = express();
require("dotenv").config();

const cors = require("cors");
// DB connection
require("./db");
require("express-async-errors");

//Requiring Routes
const usersRouter = require("./src/routes/usersRoutes");
const msgRouter = require("./src/routes/msgRoutes");
const notificationRouter = require("./src/routes/notificationRoutes");

app.use(cors());

// parsing incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/users", usersRouter);
app.use("/messeges", msgRouter);
app.use("/notifications", notificationRouter);
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
