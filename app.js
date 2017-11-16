var express                 = require("express"),
    flash                   = require("connect-flash"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    methodOverride          = require("method-override"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose");

var User        = require("./models/user"),
    seedDB      = require("./seeds");
    
var campgroundRoutes    = require("./routes/campgrounds"),
    commentsRoutes      = require("./routes/comments"),
    indexRoutes         = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();

// ========================
//  PASSPORT CONFIGURATION
// ========================

app.use(require("express-session")({
    secret: "This string can be anything I want",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //User.authenticate is from passport-local-mongoose
passport.serializeUser(User.serializeUser()); //these are also from p-l-m
passport.deserializeUser(User.deserializeUser());

//this function makes it so we don't have to add {currentUser: req.user} in every res.render()
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("DoullyCamp server initialized.");
});