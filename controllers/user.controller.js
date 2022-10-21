const db = require("../models");
const Post = db.post;
const User = db.user;
const moment = require("moment");

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    console.log(req.userId)
    res.status(200).send("User Content.");
};


exports.post = (req, res) => {
    console.log(req.userId)

    const post = new Post({
        text: req.body.text,
        author: req.userId,
        post_time: moment().format(),
    });
    post.save((err, post) => {
        if (err) {
            res.status(500).json({ message: err });
            return;
        }
        else{
            res.json({ message: "Post successfully!" });
        }
    })
};

exports.home = async (req,res) => {

    const home = await Post.find().sort({post_time: -1}).skip((req.body.page-1)*10).limit(10);
    console.log(home)
    res.json(home);
};