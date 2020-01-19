var express = require("express");
var router = express.Router({mergeParams: true});
var Commodity = require("../models/commodity");
var middleware = require("../middleware");

var linear = require('../model');
var minPrice;
// Show Commodities

// var minBid = Math.round(Math.random() * (7800 - 6800) + 6800)

router.get("/", middleware.isLoggedIn, function(req, res) {
    Commodity.find({}, function(err, allCommodities) {
        if(err) {
            req.flash("error", "Commodities could not be loaded!");
            req.redirect("/");
        }
        else {
            res.render("commodities/index", {commodities: allCommodities});
        }
    });
});

// Post New Commodity Info
router.post("/", middleware.isLoggedIn, function(req, res) {
    var item = req.body.item;
    linear.predictor(item, currentUser.normalstorage_filled)
    var quantity = req.body.quantity;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    if(item == 'Onion') {
        minPrice = 4890
    } else {
        minPrice = 7055
    }
    var currentPrice = minPrice;
    var newCommodity = {item: item, quantity: quantity, image: image, minPrice: minPrice, currentPrice: currentPrice, description: desc, author: author, accepted: false};
    Commodity.create(newCommodity, function(err, newDesg) {
        if (err) {
            req.flash("error", "Commodity could not be added!");
            res.redirect("/commodities/new");
        } else {
            req.flash("success", "Commodity added successfully!");
            res.redirect("/commodities");
        }
    });
});

// Show New Commodity Form
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("commodities/new");
});

// Show Commodity Info
router.get("/:id", function(req, res) {
    Commodity.findById(req.params.id).populate("bids").exec(function(err, foundCommodity) {
        if (err) {
            console.log(err);
        } else {
            var result = linear.predictor(foundCommodity.item, req.user.normalstorage_filled)
            res.render("commodities/show", {commodity: foundCommodity, result: result});
        }    
    });
});

// Edit
router.get("/:id/edit", middleware.checkCommodityOwnership, function(req, res) {
    Commodity.findById(req.params.id, function(err, foundCommodity) {
        if(err) {
            req.flash("error", "Commodity not found!");
            res.redirect("back");
        } else {
            res.render("commodities/edit", {commodity: foundCommodity});
        }
    });
});

// Update
router.put("/:id", middleware.checkCommodityOwnership, function(req, res) {
    Commodity.findByIdAndUpdate(req.params.id, req.body.commodity, {new: true}, function(err, updatedCommodity) {
        if(err) {
            req.flash("error", "Commodity could not be edited!");
            res.redirect("/commodities");
        } else {
            req.flash("success", "Commodity edited successfully!");
            res.redirect("/commodities/" + req.params.id);
        }
    });
});

// Destroy
router.delete("/:id", middleware.checkCommodityOwnership, function(req, res) {
    Commodity.findByIdAndRemove(req.params.id, {new: true}, function(err) {
        if(err) {
            req.flash("error", "Commodity could not be deleted!");
            res.redirect("/commodities");
        }
        else {
            req.flash("success", "Commodity deleted successfully!");
            res.redirect("/commodities");
        }
    });
});

// Reject
router.post("/:id/reject", middleware.checkCommodityOwnership, function(req, res) {
    Commodity.findById(req.params.id, function(err, commodity) {
        if(err) {
            console.log(err);
            res.redirect("/commodities");
        } else {
            var item = commodity.item;
            var image = commodity.image;
            var minBid = commodity.minBid;
            var desc = commodity.description;
            var author = {
                id: req.user._id,
                username: req.user.username
            };
            var newCommodity = {item: item, image: image, minPrice: minPrice, description: desc, author: author, accepted: false};
            Commodity.findByIdAndRemove(commodity._id, {new: true}, function(err) {
                if(err) {
                    req.flash("error", "Bid unsuccessful!");
                    res.redirect("/commodities");
                }
                else {
                    res.redirect("/commodities");
                }
            });
            Commodity.create(newCommodity, function(err, newDesg) {
                if (err) {
                    req.flash("error", "Bid Unsuccessful!");
                    res.redirect("/commodities");
                } else {
                    req.flash("success", "Bid rejected successfully!");
                }
            });
        }
    });
});

module.exports = router;