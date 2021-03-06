var mongoose = require("mongoose");

var bidSchema = mongoose.Schema({
    amount: Number,
    transport: Boolean,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        },
        username: String
    },
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Bid", bidSchema);