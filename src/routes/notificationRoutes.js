const express = require("express");
const verifyToken = require("../utils/verifyToken");
const router = express.Router();
const {
  getUserNotification,
  createNotification,
} = require("../controllers/notificationController");

router.get("/myNotification", verifyToken, getUserNotification);
router.post("/", verifyToken, createNotification);

module.exports = router;
