var express = require("express");
var router = express.Router({mergeParams: true});

var Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware/"); //when you point to directory and not a file, it'll automatically go to index.js

//CREATE FORM
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(error, foundCampground) {
        if (error) console.log(error);
        else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(error, campground) {
       if (error) console.log(error); 
       else {
           Comment.create(req.body.comment, function(error, comment) {
              if (error) console.log(error);
              else {
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  comment.save();
                  campground.comments.push(comment);
                  campground.save();
                  res.redirect("/campgrounds/" + campground._id);
              }
           });
       }
    });
});

//EDIT FORM
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(error, comment){
        //req.params.id is already predefined in route in app.js
        res.render("comments/edit", {comment: comment, campground_id: req.params.id});
    });
});

//UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, updatedComment){
        res.redirect("/campgrounds/" + req.params.id);
    })
});

//DELETE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(error){
        req.flash("success", "Comment deleted");
        res.redirect("/campgrounds/" + req.params.id);
    });
});

module.exports = router;