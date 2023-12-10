const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });

const catchAsync = require("../utilities/catchAsync");
const postLimiter = require("../utilities/postLimiter");

const User = require("../models/userModel");
const Post = require("../models/postModel");
const Avatar = require("../models/avatarModel");



const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "Must be signed in!");
        return res.redirect("/login");
    };
    next();
};

const isAuthor = async (req, res, next) => {

    const { id } = req.params;
    const post = await Post.findById(id);
    const { author } = post

    if (!author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect("/");
    };
    next();
};



router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.find({ author: id });
    const avatar = await Avatar.find({ author: id });
    const user = await User.findById(id);
    res.render("profile", { post, avatar, user, id });

}));


router.post("/", isLoggedIn, postLimiter, upload.single("image"), catchAsync(async (req, res, next) => {
    const userID = req.user._id
    const post = new Post(req.body);
    if (req.file) {
        post.image = {
            url: req.file.path,
            filename: req.file.filename,

        };
    };
    post.author = req.user;
    await post.save();
    res.redirect(`/profile/${userID}`)
}));


router.post("/avatar", isLoggedIn, postLimiter, upload.single("image"), catchAsync(async (req, res, next) => {
    const userID = req.user._id
    const avatar = new Avatar(req.body);
    avatar.image = {
        url: req.file.path,
        filename: req.file.filename,

    };
    avatar.author = req.user;
    await avatar.save();
    res.redirect(`/profile/${userID}`)
}));


router.put("/avatar/:id", isLoggedIn, upload.single("image"), catchAsync(async (req, res) => {
    const userID = req.user._id
    const { id } = (req.params);
    if (!req.file) {
        const avatar = await Avatar.findByIdAndUpdate(id, req.body);
        await avatar.save();
    } else {
        const avatar = await Avatar.findByIdAndUpdate(id, req.body);
        const { filename } = avatar.image;
        await cloudinary.uploader.destroy(filename);
        avatar.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
        await avatar.save();
    };
    res.redirect(`/profile/${userID}`)

}));


router.put("/:id", isLoggedIn, isAuthor, upload.single("image"), catchAsync(async (req, res) => {
    const userID = req.user._id
    const { id } = (req.params);
    if (!req.file) {
        const post = await Post.findByIdAndUpdate(id, req.body);
        await post.save();
    } else {
        const post = await Post.findByIdAndUpdate(id, req.body);
        const { filename } = post.image;
        await cloudinary.uploader.destroy(filename);
        post.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
        await post.save();
    };

    res.redirect(`/profile/${userID}`)

}));


router.delete("/:id", isLoggedIn, catchAsync(async (req, res) => {
    const userID = req.user._id
    const { id } = (req.params);
    const data = await Post.findByIdAndDelete(id);
    if (data.image) {
        const { filename } = data.image;
        await cloudinary.uploader.destroy(filename);
    }
    res.redirect(`/profile/${userID}`)

}));



module.exports = router;
