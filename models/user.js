var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
     username: String,
     password: String,
     type: String,
     mobile: Number,
     coldstorage: {type: Number, default: 0},
     normalstorage: {type: Number, default: 0},
     coldstorage_filled:Number,
     normalstorage_filled:Number,
     location: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);