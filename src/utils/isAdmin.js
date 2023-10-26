
const AppError = require("./AppError");
const isAdmin = async (req, res, next) => {
  // logged in user
  if (!req.user.role === 'admin') {
    return next(new AppError("You Don't Have Permissions to delete User", 403));
  }
  next();
};

module.exports = isAdmin;
