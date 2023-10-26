const express = require('express');
const app = express();
const router = express.Router();

const verifyToken = require('../utils/verifyToken'); // logged in users, admins, or super admins
const canEditUser = require('../utils/user/canEditUser');
const isAdmin = require('../utils/isAdmin');

const { cloudinaryConfig } = require('../utils/config/cloudinaryConfig');
const { multerUploads } = require('../utils/multer');

const {
  getAllUsers,
  getUserById,
  register,
  updateUser,
  uploadUserPic,
  updateRole,
  changePassword,
  deleteUser,
  login,
} = require('../controllers/userController');

const { validateReg, validateLogin, validateChangePass } = require('../utils/validation');

// getting all users
router.get('/', verifyToken, getAllUsers);

// getting user by id
router.get('/user-info', verifyToken, getUserById);

// create a new user (register)
router.post('/', validateReg, register);

// update user
router.patch('/:id', verifyToken, canEditUser, updateUser);

// app.use("/:id/profile_pic", cloudinaryConfig);
router.patch(
  '/:id/profile_pic',
  verifyToken,
  canEditUser,
  multerUploads.single('image'),
  cloudinaryConfig,
  uploadUserPic
);
router.patch('/:id/changePassword', verifyToken, validateChangePass, changePassword);
router.patch('/changeRole', verifyToken, isAdmin, updateRole);
// delete user
router.delete('/:id', verifyToken, isAdmin, deleteUser);

// login
router.post('/login', validateLogin, login);

module.exports = router;
