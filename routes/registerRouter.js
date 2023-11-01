const express = require("express");
const router = express.Router();

const User = require("../models/userModel");



router.get("/", (req, res) => {
    res.render("user/register")
});

router.post("/", async (req, res) => {
    try {
        const { name, email, username, password } = req.body;
        const user = new User({ name, email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome!');
            res.redirect('/');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/explore');
    }
});




module.exports = router;
