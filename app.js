// import Mongoose 
const mongoose = require('mongoose');

// create a new Express server
const express = require("express");

// import body parser we can parse the JSON we send to our frontend
// but now Express itself comes with a body-parser built inside now so use that instead.
const bodyParser = require('body-parser');

const passport = require('passport');

// import others
const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");

const app = express();
// import my key
const db = require('./config/keys').mongoURI;

const path = require('path');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  })
}

// const passport = require('passport');

// connect to MongoDB using Mongoose
// add useUnifiedTopology: true
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

// add the middleware for Passport
app.use(passport.initialize());
// setup a configuration file for Passport 
require('./config/passport')(passport);

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// since bodyParser is deprecated => change bodyParser to express
// and change false to true 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set up a route
// console.log for debug, we can run npm run server:debug and then see it in console
app.get("/", (req, res) =>{
    console.log(res);
    res.send("Hi !!!");
});


app.use("/api/users", users);
app.use("/api/tweets", tweets);

// set up the port
const port = process.env.PORT || 5000;

// tell Express to start a socket and listen for connections on the path
app.listen(port, () => console.log(`Server is running on port ${port}`));

// npm install -D nodemon 
// nodemon only used in dev so -D instead of production