// Declarations
var bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    passportLocal = require("passport-local"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    express = require("express"),
    app = express();

// Models
var commodity = require("./models/commodity"),
    Bid = require("./models/bid"),
    User = require("./models/user");

// Routes
var commodityRoutes = require("./routes/commodities"),
    bidRoutes = require("./routes/bids"),
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb+srv://user:user@krushak-unnati-xikl2.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);

// Default Settings
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Passport Config
app.use(require("express-session")({
    secret: "abc",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Routing
app.use(indexRoutes);
app.use("/commodities", commodityRoutes);
app.use("/commodities/:id/bids", bidRoutes);

//Receive sms and response
const http = require('http');
// const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
// const bodyParser = require('body-parser');


// app.use(bodyParser.urlencoded({ extended: true }));
// var client = require('./sms.js');
  app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();

  console.log(req.body.Body);
	  str=req.body.Body;
  // console.log(str.split(',').join("\r\n"));
	  list_details=str.split(' ');
	  // console.log(list_details[2])
	  if(list_details.length==3){
		  //Farmer Sign Up using SMS
	  var newUser = new User({username: list_details[0], mobile: list_details[2]});
    User.register(newUser, list_details[1], function(err, user) {
		const accountSid = 'AC60a73ba734edfe8f62b3e82ea3da4467';
	const authToken = '82b0adef9db385d97eef3edd5e622741';
	const client = require('twilio')(accountSid, authToken);

	// const phone = Number(list_details[2].toString());
	// console.log(typeof(list_details[2]));
	const numb = list_details[2].toString();
	// numb = '0'+numb;
	client.messages
	  .create({
		 body: 'Welcome to Krushak Unnati, '+list_details[0],
		 from: '+12563914462',
		 to: numb
	   })
	  .then(message => console.log(message.sid));

module.exports = client;
		
        if(err) {
            twiml.message('Registration failed, try again later!');
        }else{
		twiml.message('Registration Successful!');
		
			}
			});
	}
	 else{
	// var title = list_details[0];
	// var minBid = req.body.minBid;
	// var currentBid = req.body.minBid;
	// var desc = req.body.description;
	// var author = {
	// id: req.user._id,
	// username: req.user.username
	// };
	// var newCommodity = {title: title, image: image, minBid: minBid, currentBid: currentBid, description: desc, author: author, accepted: false};
	// Commodity.create(newCommodity, function(err, newDesg) {
	// if (err) {
	// req.flash("error", "Commodity could not be added!");
	// res.redirect("/commodities/new");
	// } else {
	// req.flash("success", "Commodity added successfully!");
	// res.redirect("/commodities");
	// }
	// });
}

  // console.log(req.body);
  if (req.body.Body == 'hello') {
    twiml.message('Hi!');
  } else if (req.body.Body == 'bye') {
    twiml.message('Goodbye');
  } else {
    twiml.message(
      'No Body param match, Twilio sends this in the request to your server.'
    );
  }
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

// Setting up Port
app.listen(3000, process.env.IP, function() {
    console.log("Krushak Unnati Server is Active!");
});