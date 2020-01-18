// Declarations
var bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    // MongoDBStore = require('connect-mongodb-session'),
    // store = new MongoDBStore({
    //     uri: "mongodb://frizzid:frizzid303@ds227939.mlab.com:27939/vlift",
    //     databaseName: "vlift"
    // }),
    
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
// seedDB();

// Passport Config
app.use(require("express-session")({
    secret: "abc",
    // store: store,
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

  app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();

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
    console.log("VLift Server is Active!");
});