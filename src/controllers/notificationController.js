const Notification = require("../models/Notification");
const User = require("../models/User");

const AppError = require("../utils/AppError");

const getUserNotification = async (req, res, next) => {
  const notification = await Notification.find({ user: req.user._id });
  res.status(200).send(notification);
};

const createNotification = async (req, res, next) => {
  const { title, user } = req.body;

  const getUser = await User.findById(user);
  if (!getUser) {
    return next(new AppError("User not found", 404));
  }
  const created_at = Date.now();
  const notificationCreated = await Notification.create({
    title,
    user,
    created_at,
  });
  res
    .status(200)
    .send(`Notification ${title} has been created  ${notificationCreated}`);
};
module.exports = {
  getUserNotification,
  createNotification,
};
