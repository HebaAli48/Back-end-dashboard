const Msg = require("../models/Msg");
const User = require("../models/User");
const AppError = require("../utils/AppError");

const getUserMsg = async (req, res, next) => {
  const msg = await Msg.find({ user: req.user._id });
  res.status(200).send(msg);
};

const createMsg = async (req, res, next) => {
  const { title, content, user } = req.body;

  const getUser = await User.findById(user);
  if (!getUser) {
    return next(new AppError("User not found", 404));
  }
  const created_at = Date.now();
  const msgCreated = await Msg.create({ title, user, content, created_at });
  res.status(200).send(`Messege ${title} has been created  ${msgCreated}`);
};

const removeFromMsg = async (req, res, next) => {
  const iD = req.params.id;
  const msgDeleted = await Msg.findByIdAndDelete(iD);
  if (!msgDeleted) {
    return next(new AppError("Messege is not found", 404));
  }
  res.status(200).send(`Messege ${msgDeleted.title} removed from Messeges `);
};

module.exports = {
  getUserMsg,
  removeFromMsg,
  createMsg,
};
