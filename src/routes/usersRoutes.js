const express = require("express");
const router = express.Router();

const verifyToken = require("../utils/verifyToken"); // logged in users, admins, or super admins

const { cloudinaryConfig } = require("../utils/config/cloudinaryConfig");
const { multerUploads } = require("../utils/multer");

const {
  getAllUsers,
  getUserById,
  register,
  uploadUserPic,
  login,
} = require("../controllers/userController");

const { validateReg, validateLogin } = require("../utils/validation");

// getting all users
router.get("/", verifyToken, getAllUsers);

// getting user by id
router.get("/user-info", verifyToken, getUserById);

// create a new user (register)
router.post("/", validateReg, register);
// edit profile pic
router.patch(
  "/:id/profile_pic",
  verifyToken,
  multerUploads.single("image"),
  cloudinaryConfig,
  uploadUserPic
);

// login
router.post("/login", validateLogin, login);

module.exports = router;
