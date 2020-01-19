var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
     username: String,
     password: String,
     type: String,
     mobile: Number,
<<<<<<< HEAD
     coldstorage: {type: Number, default: 0},
     normalstorage: {type: Number, default: 0},
=======
     coldstorage: Number,
     normalstorage: Number,
     coldstorage_filled:Number,
     normalstorage_filled:Number,
>>>>>>> 6724b96bf35353e94a85eebe9212dce0ee2ac211
     location: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);