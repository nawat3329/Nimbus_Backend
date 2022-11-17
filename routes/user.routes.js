const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const uploadimagescontroller = require("../controllers/upload_images.controller");
const multer = require('multer');
const upload = multer();

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/content/all", controller.allAccess);

    app.get("/api/content/user", [authJwt.verifyToken], controller.userBoard);

    app.post("/api/content/insertpost", [authJwt.verifyToken], controller.insertPost);

    app.get("/api/content/home", controller.home);

    app.get("/api/content/homefollow",[authJwt.verifyToken], controller.homefollow);

    app.get("/api/content/profile", [authJwt.verifyToken], controller.profile);

    app.post("/api/content/accountsetting", [authJwt.verifyToken], controller.accountsetting);

    app.post("/api/content/editpost", [authJwt.verifyToken], controller.editpost);

    app.post("/api/content/deletepost", [authJwt.verifyToken], controller.deletepost);

    app.post("/api/content/follow", [authJwt.verifyToken], controller.follow);

    app.post("/api/content/unfollow", [authJwt.verifyToken], controller.unfollow);

    app.get("/api/content/getProfileContent", [authJwt.verifyToken], controller.getProfileContent);

    app.get("/api/content/getProfileDetail", [authJwt.verifyToken], controller.getProfileDetail);

    app.get("/api/content/getSelfProfileContent", [authJwt.verifyToken], controller.getSelfProfileContent);

    app.get("/api/content/getpostdetail", [authJwt.verifyToken], controller.getpostdetail);

    app.get("/api/content/seefollower", [authJwt.verifyToken], controller.seefollower);

    app.get("/api/content/seefollowing", [authJwt.verifyToken], controller.seefollowing);

    app.post("/api/content/searchuser", [authJwt.verifyToken], controller.searchuser);

    app.post("/api/content/addcomment", [authJwt.verifyToken], controller.addcomment);

    app.post("/api/content/deletecomment", [authJwt.verifyToken], controller.deletecomment);

    app.post("/api/content/like", [authJwt.verifyToken], controller.like);

    app.post("/api/content/unlike", [authJwt.verifyToken], controller.unlike);

    app.post("/api/content/insertpostimage", [authJwt.verifyToken, upload.any()], uploadimagescontroller.insertpostimage);
};