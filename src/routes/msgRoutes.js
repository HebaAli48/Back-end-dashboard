const express = require("express");
const verifyToken = require("../utils/verifyToken");
const router = express.Router();
const {
  getUserMsg,
  removeFromMsg,
  createMsg,
} = require("../controllers/msgController");

router.get("/myMsg", verifyToken, getUserMsg);
router.post("/", verifyToken, createMsg);
router.delete("/:id", verifyToken, removeFromMsg);

module.exports = router;
