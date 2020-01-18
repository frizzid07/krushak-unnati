var express = require("express");
var router = express.Router({mergeParams: true});
var Commodity = require("../models/commodity");
var middleware = require("../middleware");

// Show Commoditys
router.get("/", function(req, res) {
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
    var title = req.body.title;
    var image = req.body.image;
    var minBid = req.body.minBid;
    var currentBid = req.body.currentBid;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCommodity = {title: title, image: image, minBid: minBid, currentBid: currentBid, description: desc, author: author, accepted: false};
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
            res.render("commodities/show", {commodity: foundCommodity});
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
            var title = commodity.title;
            var image = commodity.image;
            var salary = commodity.salary;
            var desc = commodity.description;
            var author = {
                id: req.user._id,
                username: req.user.username
            };
            var newCommodity = {title: title, image: image, minBid: minBid, description: desc, author: author, accepted: false};
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