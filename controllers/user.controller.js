const db = require("../models");
const Post = db.post;
const User = db.user;
const moment = require("moment");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  console.log(req.userId);
  res.status(200).send("User Content.");
};

exports.insertPost = (req, res) => {
  console.log(req.userId);

  const insertpost = new Post({
    text: req.body.text,
    author: req.userId,
    post_time: moment().format(),
    visibility: req.body.visibility,
  });
  insertpost.save((err, insertpost) => {
    if (err) {
      res.status(500).json({ message: err });
      return;
    } else {
      res.json({ message: "Post successfully!" });
    }
  });
};

exports.home = async (req, res) => {
  console.log("This user is " + req.userId);
  const home = await Post.find({ visibility: "Public" })
    .sort({ post_time: -1 })
    .skip((req.body.page - 1) * 10)
    .limit(10)
    .lean();
  const postRes = [];
  for (let i = 0; i < home.length; i++) {
    const finduser = await User.findOne(
      { _id: home[i].author },
      { username: 1, images: 1, _id: 0 }
    ).lean();;
    const merged = {...home[i],...finduser}
    postRes.push(merged);
  }
  console.log(postRes)
  res.status(200).send(postRes);
  return;
};

exports.profile = async (req, res) => {
  console.log("This user is " + req.userId);
  const profile = await User.findOne(
    { _id: req.userId },
    { _id: 1, username: 1, images: 1 }
  );
  res.status(200).send(profile);
};

exports.setting = async (req, res) => {
  console.log("This user is " + req.userId);
  const setting = await User.updateOne(
    { _id: req.userId },
    {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      images: req.body.images,
    }
  );
  res.status(200).send(setting);
};

exports.editpost = async (req, res) => {
  console.log("This user is " + req.userId);
  const editpost = await Post.updateOne(
    { _id: req.body.postId },
    {
      text: req.body.text,
      images: req.body.images,
      edit_time: moment().format(),
      visibility: req.body.visibility,
    }
  );
  res.status(200).send(editpost);
};

exports.follow = async (req, res) => {
  const findfollow = await User.findOne(
    { $and: [{ _id: req.body.userId }, { follower: req.userId }] },
    { _id: 1, username: 1, follower: 1, following: 1 }
  );
  //return followed user
  console.log("This user is: " + req.userId);
  console.log("Trying to follow: " + req.body.userId);
  if (findfollow == null) {
    const following = await User.findOneAndUpdate(
      { _id: req.userId },
      { $push: { following: req.body.userId } }
    );
    const follower = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $push: { follower: req.userId } }
    );
    res
      .status(200)
      .send(following, follower, { message: "Follow successfully!" });
    return;
  } else {
    res.status(400).send({ message: "You already followed this user!" });
    return;
  }
};

exports.getTotalPageHome = async (req, res) => {
    const count = await Post.count({visibility: "Public"});
    console.log(count)
    const totalPage = (Math.ceil(count/10));
    res.send({totalPage});
    return;
};


exports.unfollow = async (req, res) => {
  const findfollow = await User.findOne(
    { $and: [{ _id: req.body.userId }, { follower: req.userId }] },
    { _id: 1, username: 1, follower: 1, following: 1 }
  );
  //return other user
  console.log("This user is: " + req.userId);
  console.log("Other user is: " + req.body.userId);
  if (findfollow == null) {
    res.status(400).send({ message: "You do not follow this user yet!" });
    return;
  } else { 
    //A unfollow B => Delete A from B Follower, Delete B from A Following
    const deletefollowing = await User.findOne(
      { _id: req.userId, follower:req.body.userId }
    );
    const deletefollower = await User.findOne(
      { _id: req.userId }
    );
    res
      .status(200)
      .send(deletefollowing, deletefollower, { message: "Unfollow successfully!" });
    return;
  }
};
