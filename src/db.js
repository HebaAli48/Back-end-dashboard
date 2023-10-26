const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to db!"))
  .catch((err) => console.log(err));
