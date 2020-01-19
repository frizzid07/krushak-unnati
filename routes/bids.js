var express = require("express");
var router = express.Router({mergeParams: true});
var Commodity = require("../models/commodity");
var Bid = require("../models/bid");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res) {
    Commodity.findById(req.params.id, function(err, commodity) {
        if(err) {
            console.log(err);
        } else {
            res.render("bids/new", {commodity: commodity});
        }
    });
});

router.post("/", function(req, res) {
    Commodity.findById(req.params.id, function(err, commodity) {
        if(err) {
            console.log(err);
            res.redirect("/commodities");
        } else {
            Bid.create(req.body.bid, function(err, bid) {
                if (err) {
                    console.log(err);
                } else {
                    // Add Username to Bid
                    bid.author.id = req.user._id;
                    bid.author.username = req.user.username;
                    bid.save();
                    commodity.bids.push(bid);
                    commodity.save();
                    req.flash("success", "Bid added successfully!");
                    res.redirect("/commodities/" + commodity._id);
                }            
            });
        }
    });
});

// Edit
router.get("/:bid_id/edit", middleware.checkBidOwnership, function(req, res) {
    Bid.findById(req.params.bid_id, function(err, foundBid) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("bids/edit", {commodity_id: req.params.id, bid: foundBid});
        }
    });
});

// Update
router.put("/:bid_id", middleware.checkBidOwnership, function(req, res) {
    Bid.findByIdAndUpdate(req.params.bid_id, req.body.bid, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment edited successfully!");
            res.redirect("/commodities/" + req.params.id);
        }
    });
});

// Delete
router.delete("/:bid_id", middleware.checkBidOwnership, function(req, res) {
    Bid.findByIdAndRemove(req.params.bid_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted successfully!");
            res.redirect("/commodities/" + req.params.id);
        }
    });
});

// Accept
router.post("/:bid_id", middleware.checkCommodityOwnership, function(req, res) {
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
            var newCommodity = {item: item, image: image, minBid: minBid, description: desc, author: author, accepted: true};
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
                    req.flash("success", "Bid successful!");
                }
            });        
        }
    });
});

module.exports = router;