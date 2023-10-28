const mongoose = require("mongoose");

const { Schema } = mongoose;

const msgSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
  },
});

const Msg = mongoose.model("Msg", msgSchema);

module.exports = Msg;
