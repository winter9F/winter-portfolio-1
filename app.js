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
const multer = require("multer");
const { storage } = require("./cloudinary");
const upload = multer({ storage });


const User = require("./models/userModel");
const Post = require("./models/postModel");
const Avatar = require("./models/avatarModel");

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

app.get("/", (req, res) => {
    res.render("home")
});

app.get("/login", (req, res) => {
    res.render("user/login");
});

app.post("/login", passport.authenticate("local", { failureMessage: true, failureRedirect: "/explore" }), (req, res) => {
    req.flash("success", "Successfully signed in!");
    res.redirect("/")

})

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

app.get("/register", (req, res) => {
    res.render("user/register")
});

app.post("/register", async (req, res) => {
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
        res.redirect('register');
    }
});


app.get("/explore", async (req, res) => {
    const post = await Post.find()
    console.log(post.text)
    res.render("explore", { post })
});

app.get("/profile", async (req, res) => {
    const avatar = await Avatar.find();
    const post = await Post.find();
    res.render("profile", { post, avatar })
});

app.post("/profile", upload.array("image"), async (req, res, next) => {
    const post = new Post(req.body);
    post.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await post.save();

    res.redirect("/")
});
app.post("/avatar", upload.single("image"), async (req, res, next) => {
    const avatar = new Avatar(req.body);
    avatar.image = {
        url: req.file.path,
        filename: req.file.filename,

    }
    await avatar.save();

    res.redirect("/")
});







app.listen(3000, () => {
    console.log("Port 3000 Active!")
});