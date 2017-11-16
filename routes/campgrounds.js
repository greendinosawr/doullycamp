var express = require("express");
var router = express.Router();

var Campground = require("../models/campground"),
    middleware = require("../middleware/"); //when you point to directory and not a file, it'll automatically go to index.js

//INDEX
router.get("/", function(req, res) {
    Campground.find({}, function(error, allCampgrounds) {
        if (error) {
            console.log(error);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {
        name: req.body.name, 
        image: req.body.image,
        price: req.body.price,
        description: req.body.description,
        author: author
    };
    Campground.create(newCampground, function(error, object) {
        if (error) {
            console.log(error);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//CREATE FORM
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//VIEW
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground) {
      if (error) {
          console.log(error);
      } else {
          res.render("campgrounds/show", {campground: foundCampground});
      }
    });
});

//EDIT FORM
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(error, campground){
        res.render("campgrounds/edit", {campground: campground});
   });
});

//UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error, updatedCampground){
        res.redirect("/campgrounds/" + updatedCampground._id);
    })
});

//DELETE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(error){
        req.flash("success", "Campground deleted");
        res.redirect("/campgrounds");
    });
});

module.exports = router;