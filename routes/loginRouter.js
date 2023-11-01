const express = require("express");
const router = express.Router();




router.get("/", (req, res) => {
    res.render("user/login");
});

router.post("/", passport.authenticate("local", { failureMessage: true, failureRedirect: "/explore" }), (req, res) => {
    req.flash("success", "Successfully signed in!");
    res.redirect("/")

});




module.exports = router;
