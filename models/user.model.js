const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    follower: [String],
    following: [String],
    images: String,
  })
);


module.exports = User;