const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });
const Joi = require("joi");

const ExpressError = require("../utilites/ExpressError");
const catchAsync = require("../utilites/catchAsync");

const User = require("../models/userModel");
const Post = require("../models/postModel");
const Avatar = require("../models/avatarModel");



// const validatedPost = (req, res, next) => {
//     const postSchema = Joi.object({
//         text: Joi.string(),
//         image: Joi.any()
//     }).xor("text", "image");

//     const { error } = postSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(",")
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }


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


router.post("/", isLoggedIn, upload.single("image"), catchAsync(async (req, res, next) => {
    backURL = req.header('Referer') || '/';
    const post = new Post(req.body);
    if (req.file) {
        post.image = {
            url: req.file.path,
            filename: req.file.filename,

        };
    };
    post.author = req.user;
    await post.save();

    res.redirect(backURL);
}));


router.post("/avatar/:id", isLoggedIn, upload.single("image"), catchAsync(async (req, res, next) => {
    backURL = req.header('Referer') || '/';
    const avatar = new Avatar(req.body);
    avatar.image = {
        url: req.file.path,
        filename: req.file.filename,

    };
    avatar.author = req.user;
    await avatar.save();

    res.redirect(backURL);
}));


router.put("/avatar/:id", isLoggedIn, isAuthor, upload.single("image"), catchAsync(async (req, res) => {
    backURL = req.header('Referer') || '/';
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

    res.redirect(backURL);

}));


router.put("/:id", isLoggedIn, isAuthor, upload.single("image"), catchAsync(async (req, res) => {
    backURL = req.header('Referer') || '/';
    const { id } = (req.params);
    if (!req.file) {
        const post = await Post.findByIdAndUpdate(id, req.body);
        await post.save();
    } else {
        const post = await Post.findByIdAndUpdate(id, req.body);
        const [{ filename }] = post.image;
        await cloudinary.uploader.destroy(filename);
        post.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
        await post.save();
    };

    res.redirect(backURL);

}));


router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res) => {

    const { id } = (req.params);
    const data = await Post.findById(id);
    const [{ filename }] = data.image;
    await cloudinary.uploader.destroy(filename);
    await Post.findByIdAndDelete(id);
    res.redirect("/")

}));


module.exports = router;
