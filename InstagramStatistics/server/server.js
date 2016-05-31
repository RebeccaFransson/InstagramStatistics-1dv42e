"use strict";
var express = require("express");
var bodyParser = require("body-parser")
var mongoose = require("mongoose");
var CronJob = require('cron').CronJob;
var path = require("path");

//controllers
var userController = require("./controllers/usersController");
var updateUsersController = require("./controllers/updateUsersController");

//Express request pipeline
var app = express();
app.use(express.static(path.join(__dirname, "../app/dist")));
app.use(bodyParser.json());
app.use("/", userController);

app.listen(8080, function () {
    console.log("Started listening on port", 8080);
});

//ansluter till min mongo-db
var mongoURI = "mongodb://188.166.116.158:27017/ISDb";
var MongoDB = mongoose.connect(mongoURI).connection;
MongoDB.on('error', function(err) { console.log(err.message); });
MongoDB.once('open', function() {
  console.log("mongodb connection open");

  //en gång i veckan, varje måndag
  /*new CronJob('* * * * * 1', function() {
    console.log('-----Updating...-------');
    updateUsersController.checkForUpdate();
  }, function(){
    console.log('-----Done updating!-------');
  }, true, 'Europe/Stockholm');*/

//test: en gång om dagen kl 11:59
  new CronJob('0 59 11 * * *', function() {
    console.log('-----Updating...-------');
    console.log(new Date());
    updateUsersController.checkForUpdate();
  }, function(){
    console.log('-----Done updating!-------');
  }, true, 'Europe/Stockholm');

});
