var mongoose = require("mongoose");
var commoditySchema = new mongoose.Schema({
    item: String,
    image: String,
    quantity: Number,
    description: String,
    minPrice: Number,
    currentPrice: Number,
    author: {
        id: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        },
        username: String
    },
    bids: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Bid"
        }
    ],
    created: {type: Date, default: Date.now},
    accepted: Boolean
});

module.exports = mongoose.model("Commodity", commoditySchema);