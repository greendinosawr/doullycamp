var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

//adds a bunch of functions from passportLocalMongoose into userSchema model
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);