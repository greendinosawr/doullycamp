var Campground  = require("../models/campground"),
    Comment     = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    req.headers.referer = '/campgrounds/'+req.params.id; //need this line for redirect("back") to work
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(error, foundCampground){
            if (error) {
                req.flash("error", "Campground doesn't exist.")
                res.redirect("back");
            } else if (foundCampground.author.id.equals(req.user._id)) {
                next(); //object.user.id is mongoose obj and req.user._id is string despite them looking the same
            } else {
                req.flash("error", "You don't have permission to do that.");
                res.redirect("back");
            }
        });
    } else {
        req.flash("error", "You must be logged in first.");
        res.redirect("/login");
    }  
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    req.headers.referer = '/campgrounds/'+req.params.id; //need this line for redirect("back") to work
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(error, foundComment){
            if (error) {
                req.flash("error", "Something went wrong :(");
                res.redirect("back");
            }
            else if (foundComment.author.id.equals(req.user._id)) next(); //object.user.id is mongoose obj and req.user._id is string despite them looking the same
            else {
                req.flash("error", "You don't have permission to do that.");
                res.redirect("back");
            }
        });
    } else {
        res.redirect("/login");
    }
}

middlewareObj.isLoggedIn =  function(req, res, next) {
    if (req.isAuthenticated()) return next();
    //req.flash(key, value) - value gets stored into key
    //req.flash(key) - returns associated value
    req.flash("error", "You must be logged in first.");
    res.redirect("/login");
}

module.exports = middlewareObj;