const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Order = require("./Order");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
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
        "https://res.cloudinary.com/ddkkalgoh/image/upload/v1687376480/profile_pics/Default_Avatar.jpg",
    },
    balance: {
      type: Number,
      default: 0,
    },
    // library: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Library",
    //   default: new mongoose.Types.ObjectId("4edd40c86762e0fb12000003"),
    // },
    // wishlist: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Wishlist",
    //   default: new mongoose.Types.ObjectId("4edd40c86762e0fb12000003"),
    // },
    // cart: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Cart",
    //   default: new mongoose.Types.ObjectId("4edd40c86762e0fb12000003"),
    // },
    //   orders: [
    //     {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "Order",
    //     },
    //   ],
    created_at: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "user",
});
userSchema.virtual("wishlist", {
  ref: "Wishlist",
  localField: "_id",
  foreignField: "user",
});
userSchema.virtual("cart", {
  ref: "Cart",
  localField: "_id",
  foreignField: "user",
});
userSchema.virtual("library", {
  ref: "Library",
  localField: "_id",
  foreignField: "user",
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

// userSchema.pre("findOne", async function () {
//   // this.populate('library');
//   let id = this.getQuery()["_id"];
//   //   console.log("this", this._id);
//   //   console.log("id", id);
//   //   this.orders = await Order.find({ user: id });
//   //   console.log(this.orders);
//   this.populate({
//     path: "library",
//     select: ["products"],
//     populate: { path: "products", model: "Product" },
//   });
//   this.populate({
//     path: "wishlist",
//     select: ["products"],
//     populate: { path: "products", model: "Product" },
//   });
//   this.populate({
//     path: "cart",
//     select: ["products"],
//     populate: { path: "products", model: "Product" },
//   });
//   //   this.populate("orders");
//   this.populate({
//     path: "orders",
//     select: ["products", "totalPrice", "createdAt"],
//     populate: { path: "products", model: "Product" },
//   });
// });

// userSchema.pre("find", async function () {
//   // this.populate('library');
//   let id = this.getQuery()["_id"];
//   //   console.log("this", this._id);
//   //   console.log("id", id);
//   this.orders = await Order.find({ user: this._id });
//   this.populate({
//     path: "library",
//     select: ["products"],
//     populate: { path: "products", model: "Product" },
//   });
//   this.populate({
//     path: "wishlist",
//     select: ["products"],
//     populate: { path: "products", model: "Product" },
//   });
//   this.populate({
//     path: "cart",
//     select: ["products"],
//     populate: { path: "products", model: "Product" },
//   });
//   this.populate({
//     path: "orders",
//     select: ["products"],
//     populate: { path: "products", model: "Product" },
//   });
// });
/*
  instance methods
*/
// comparing the stored password with the entered one
userSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

const User = mongoose.model("users", userSchema);
module.exports = User;
