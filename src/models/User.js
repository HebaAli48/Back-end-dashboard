const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Msg = require("./Msg");
const Notification = require("./Notification");

const { Schema } = mongoose;

const userSchema = new Schema({
  user_name: {
    type: String,
    required: true,
    minLength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  profile_pic: {
    type: String,
    default:
      "http://res.cloudinary.com/dnszuaxw1/image/upload/v1698415868/profile_pics/defaultUser.png.png",
  },

  created_at: {
    type: Date,
    default: Date.now(),
  },

  messeges: [
    {
      type: Schema.Types.ObjectId,
      ref: "Msg",
    },
  ],
  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
});

// hashing password before saving the document to the db
userSchema.pre("save", async function () {
  // hashing password only when changed,
  //  because this pre middlware will be executed when updating also.
  if (this.isModified("password")) {
    const hashedPassword = await bcrypt.hash(
      this.password,
      +process.env.HASHING_COST
    );
    this.password = hashedPassword;
  }
});

// avoid returning the password in the response
userSchema.post("save", function () {
  this.password = undefined;
});

// comparing the stored password with the entered one
userSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

const User = mongoose.model("users", userSchema);
module.exports = User;
