const AppError = require("../AppError");
const jwt = require("jsonwebtoken");

const canEditUser = async (req, res, next) => {
  // Checking id provided in parameters
  const edit_id = req.params.id;
  if (!edit_id)
    return next(
      new AppError("No id provided, please provide an id!", 400)
    );

  // logged in user
  if( !req.user._id === edit_id && !req.user.role === "admin"){
    return next(new AppError("You Don't Have Permissions to edit this user", 403));
  }

  next();
};

module.exports = canEditUser;
