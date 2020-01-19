var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../models/user");
var userType;

// Landing
router.get("/", function(req, res) {
    res.render("landing");
});

//Choose
router.get("/choose", function(req, res) {
    res.render("choose")
});

// Login
router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local",{
        successRedirect: "/commodities",
        failureRedirect: "/",
        failureFlash: true
    }), function(req, res) {
    req.flash("success", "Logged in Successfully!");
});

// Register
router.get("/registerFarmer", function(req, res) {
    res.render("registerFarmer");
    userType = "Farmer"
});

router.get("/registerDistributor", function(req, res) {
    res.render("registerDistributor");
    userType = "Distributor"
});

router.post("/register", function(req, res) {

    var newUser = new User({username: req.body.username, mobile: req.body.mobile, type: userType, normalstorage: req.body.normalstorage, coldstorage: req.body.coldstorage, location: req.body.location});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message);
            return res.render("landing");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to Krushak Unnati, " + user.username);
            res.redirect("/commodities");
        });
    });
});

// Logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out Successfully!");
    res.redirect("/commodities");
});

module.exports = router;