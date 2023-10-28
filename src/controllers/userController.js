const User = require("../models/User");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");

const { multerUploads, dataUri } = require("../utils/multer");
const { uploader } = require("../utils/config/cloudinaryConfig");
const Notification = require("../models/Notification");
const Msg = require("../models/Msg");

const getAllUsers = async (req, res, next) => {
  const users = await User.find();
  res.send(users);
};

const getUserById = async (req, res, next) => {
  const { user } = req;
  // console.log(user);
  if (!user) return next(new AppError("User Not Found!", 404));
  // populate User before sending response
  await postFindUser(user);
  res.send(user);
};

const register = async (req, res, next) => {
  const { user_name, email, password } = req.body;
  if (await User.findOne({ email })) {
    res.status(409).send({ message: "This Email already registered" });
  }
  let createdUser = await User.create({
    user_name,
    email,
    password,
  });

  console.log(createdUser);
  res.status(201).send({ message: "User created successfully!" });
};

const uploadUserPic = async (req, res, next) => {
  console.log("in controller");
  const { id } = req.params;
  // console.log(req.body);
  const user = await User.findById(id);
  if (!user) return next(new AppError("User Not Found", 404));
  if (req.file) {
    const file = dataUri(req.file);
    const profile_pic = await uploader.upload(file.content, {
      public_id: req.file.originalname,
      folder: "profile_pics",
    });
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { profile_pic: profile_pic.url },
      { new: true }
    );
    res.send({
      messge: "Your image has been uploded successfully to cloudinary",
      updatedUser,
    });
  } else {
    res.status(404).send({
      messge: "No Image Found",
    });
  }
};

const login = async (req, res, next) => {
  // checking if the email exists
  const { email, password } = req.body;
  const user = await User.findOne({ email: email }).select("+password");
  if (!user) return next(new AppError("Invalid Credentials!", 400));

  // checking if the password is correct
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new AppError("Invalid Credentials!", 400));

  // creating a token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ENCRYPTION_KEY
  );
  console.log(user._id);
  // remove password from response
  user.password = undefined;
  // populate User before sending response
  const getUserMsg = await Msg.find({ user: user._id });
  const getUserNotification = await Notification.find({ user: user._id });

  user.messeges = getUserMsg;
  user.notifications = getUserNotification;

  res.send({ message: "user logged in successfully!", user, token });
};

module.exports = {
  getAllUsers,
  getUserById,
  register,
  uploadUserPic,
  login,
};
