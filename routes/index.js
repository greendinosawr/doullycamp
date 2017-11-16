var express = require("express");
var router = express.Router();
var passport = require("passport");

var User = require("../models/user");

router.get("/", function(req, res) {
    res.render("landing"); 
    // res.redirect("/campgrounds");
});

router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome " + user.username + "!");
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
    //technically don't need to include this callback function
    //but it's here to remind myself that it is here.
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have logged out.");
    res.redirect("/campgrounds");
});

module.exports = router;