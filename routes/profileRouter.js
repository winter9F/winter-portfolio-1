const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });


const Post = require("../models/postModel");
const Avatar = require("../models/avatarModel");


router.get("/", async (req, res) => {
    const avatar = await Avatar.find();
    const post = await Post.find().populate("author");
    res.render("profile", { post, avatar })
});


router.post("/", upload.single("image"), async (req, res, next) => {
    const post = new Post(req.body);
    post.image = {
        url: req.file.path,
        filename: req.file.filename,

    };
    post.author = req.user;
    await post.save();

    res.redirect("/profile")
});


router.post("/avatar", upload.single("image"), async (req, res, next) => {
    const avatar = new Avatar(req.body);
    avatar.image = {
        url: req.file.path,
        filename: req.file.filename,

    };
    avatar.author = req.user;
    await avatar.save();

    res.redirect("/profile")
});


router.put("/avatar/:id", upload.single("image"), async (req, res) => {
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

    res.redirect("/profile");

});


router.put("/:id", upload.single("image"), async (req, res) => {
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

    res.redirect("/profile");

});


router.delete("/:id", async (req, res) => {
    const { id } = (req.params);
    const data = await Post.findById(id);
    const [{ filename }] = data.image;
    await cloudinary.uploader.destroy(filename);
    await Post.findByIdAndDelete(id);
    res.redirect("/profile");

});


module.exports = router;
