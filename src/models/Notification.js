const mongoose = require("mongoose");

const { Schema } = mongoose;

const notificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
