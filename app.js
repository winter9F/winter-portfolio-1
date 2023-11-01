if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}


const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");


const profileRouter = require("./routes/profileRouter");
const registerRouter = require("./routes/registerRouter")
const loginRouter = require("./routes/loginRouter")


const User = require("./models/userModel");


mongoose.connect('mongodb://127.0.0.1:27017/project1').
    catch(error => handleError(error));


const app = express();



app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'eaeiwojasfwdifsfdrjs1x213r232424290ze98r09t8!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use("/profile", profileRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);


app.get("/", (req, res) => {
    res.render("home")
});


app.get("/logout", (req, res) => {
    try {
        req.logOut(err => {
            if (err) return next(err);
            req.flash('success', "Logged out!");
            res.redirect('/');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
});


app.get("/explore", async (req, res) => {

    res.render("explore", { post })
});


app.listen(3000, () => {
    console.log("Port 3000 Active!")
});