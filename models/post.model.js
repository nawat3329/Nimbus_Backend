const mongoose = require("mongoose");

const Post = mongoose.model(
  "Post",
  new mongoose.Schema({
    author: String,
    text: String,
    post_images: String,
    post_time: Date,
    edit_time: Date,
    visibility: {
      type: String,
      enum: ["Public", "Follow", "Private"],
      default: "Public",
    },
    like: [String],
    comment: [{ usercommentid: String, usercomment: String, comment_time: Date, }],
  })
);

module.exports = Post;
