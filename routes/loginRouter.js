const express = require("express");
const router = express.Router();
const passport = require("passport");


router.get("/", (req, res) => {
    res.render("user/login");
});

router.post("/", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", "Successfully signed in!");
    res.redirect("/")

});


module.exports = router;
