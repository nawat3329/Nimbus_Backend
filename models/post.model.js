const mongoose = require("mongoose");

const Post = mongoose.model(
  "Post",
  new mongoose.Schema({
    author: String,
    text: String,
    image: String,
    post_time: Date,
    edit_time: Date,
    visibility: {
      type: String,
      enum : ['Public', 'Follow', 'Private'],
      default: 'Public'
    },
  })
);


module.exports = Post;