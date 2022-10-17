exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    console.log(req.userId)
    res.status(200).send("User Content.");
};