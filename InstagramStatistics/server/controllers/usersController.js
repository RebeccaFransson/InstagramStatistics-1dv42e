"use strict";
var mongoose = require('mongoose');
var User = require('../data/users');
var _ = require('underscore');
var storage = require('node-persist');
var statisticsController = require("./statisticsController");

var router = require('express').Router();
router.route('/saveProfile').post(getSavedStats);//.delete(deleteSchool);


function getSavedUser(id) {
  return new Promise(function(resolve, reject){
    User.findOne({ user_id: id }, function (err, user) {
      if (err) {
        reject(err)
      }
      resolve(user);
    });
  });
}

function getSavedStats(req, res) {
  storage.initSync();
  //Kollar om användaren finns i databasen
  getSavedUser(req.body.user_id).then(
    function(savedUser){
      if(savedUser != null){
        //TODO: kolla om saveduser är samma user som liggade in
        //Finns det redan sparad data? är den tillräckligt ny? använd den istället
        var day = (60000*6)*24;
        var savedTimestamp = new Date(storage.getItem('savedUserStorage').last_save).getTime() + day;//lägger till en minut - test
        var nowTime = new Date().getTime();

        if(savedTimestamp > nowTime){//Om ni vill lägga till testdata sätta denna till false
          //Hämtar sparad statistik till redan sparad användare och skickar tillbaka till klienten.
          console.log('tar från storgare');
          res.send(savedUser);
        }else{
          console.log('hämtar från api');
          //Hämtar ny statistik till redan sparad användare och skriver över.
          updateSavedUser(savedUser).then(function(user){
            res.send(user);
          })
        }
      }else{
        //Hämtar statistik till redan ny användare och sparar användaren.
        saveNewUser(req).then(function(user){
          res.send(user);
        })
      }
  });
}

function updateSavedUser(savedUser){
  console.log(new Date('Tue May 7 2016 18:11:59 GMT+0200 (Västeuropa, sommartid)'));
  //TEST-DATA om så önskas (Detta eftersom appliktionen börjar räkna från första datumet, och ni kanske vill ha lite exempeldata)
  /*var testcount = {
    mediaOverTime:
   [ { date: new Date('Tue May 7 2016 18:11:59 GMT+0200 (Västeuropa, sommartid)'),
       count: 150 },
     { date: new Date('Tue May 10 2016 18:11:59 GMT+0200 (Västeuropa, sommartid)'),
       count: 149 },
     { date: new Date('Tue May 17 2016 18:11:59 GMT+0200 (Västeuropa, sommartid)'),
       count: 151 },
     { date: new Date('Tue May 20 2016 18:11:59 GMT+0200 (Västeuropa, sommartid)'),
       count: 156 } ],
  followed_byOverTime:
   [ { date: new Date('Tue May 7 2016 18:11:59 GMT+0200 (Västeuropa, sommartid)'),
       count: 170 },
     { date: new Date('Tue May 10 2016 18:11:59 GMT+0200 (Västeuropa, sommartid)'),
       count: 177 },
     { date: new Date('Tue May 17 2016 18:11:59 GMT+0200 (Västeuropa, sommartid)'),
       count: 187 },
     { date: new Date('Tue May 20 2016 18:11:59 GMT+0200 (Västeuropa, sommartid)'),
       count: 201 } ],
  followsOverTime:
   [ { date: new Date('Tue May 7 2016 18:11:59 GMT+0200 (Västeuropa, sommartid)'),
       count: 240 },
     { date: new Date('Tue May 10 2016 18:11:59 GMT+0200 (Västeuropa, sommartid)'),
       count: 250 },
     { date: new Date('Tue May 17 2016 18:11:59 GMT+0200 (Västeuropa, sommartid)'),
       count: 245 },
     { date: new Date('Tue May 20 2016 18:11:59 GMT+0200 (Västeuropa, sommartid)'),
       count: 249 }  ]
  }*/
  return new Promise(function(resolve, reject){
    //getAllStatistics(savedUser.access_token, testcount.mediaOverTime, testcount.followed_byOverTime, testcount.followsOverTime)
    getAllStatistics(savedUser.access_token, savedUser.counts.mediaOverTime, savedUser.counts.followed_byOverTime, savedUser.counts.followsOverTime)
    .then(function(data){

      //Uppdatera existerande användare
      savedUser.counts = data[0];
      savedUser.topTwelve = data[1];
      savedUser.last_save = new Date();
      savedUser.save(function (err) {
          if (err)
              reject(err);
          else{
              storage.setItem('savedUserStorage', savedUser);
              resolve(savedUser);
          }
      });
    });
  });
}

function saveNewUser(req){
  return new Promise(function(resolve, reject){
    getAllStatistics(req.body.identities[0].access_token, [], [], [])
      .then(function(data){
        //Skapa ny användare
        var user = new User(_.extend({}, {
          user_id: req.body.user_id,
          nickname: req.body.nickname,
          profile_picture: req.body.profile_picture,
          last_save: new Date(),
          counts: {
            mediaOverTime: data[0].mediaOverTime,
            followed_byOverTime: data[0].followed_byOverTime,
            followsOverTime: data[0].followsOverTime
          },
          topTwelve: data[1],
          access_token: req.body.identities[0].access_token
        }));
        //Spara ny användare
        user.save(function (err) {
            if (err)
                reject(err);
            else{
                storage.setItem('savedUserStorage', user);
                resolve(user);
            }
        });
      });
    });
}

function getAllStatistics(access_token, media, followed, follows){
  return Promise.all([statisticsController.mediaAndFollowedBy(access_token, media, followed, follows),
                      statisticsController.getThreeMostLikedPictures(access_token)])
}
module.exports = router;
