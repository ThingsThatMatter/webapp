var express = require('express');
var router = express.Router();

var userModel = require('../models/userModel.js')
var adModel = require('../models/adModel.js')

// var request = require('sync-request');
var uid2 = require("uid2");

// var userModel = require('../models/users');

// var bcrypt = require('bcrypt');
// const saltRounds = 10;

var adIdTest = '5e5cf133e1a25d0b8a9805bd';

var userIdTest1 = '5e5cf93759f38b0e11fc0ad5';
var userIdTest2 = '5e5cfbe96c8d820efe85ad45';
var userIdTest3 = '5e5cfbf96c8d820efe85ad46';

/* User sign-in */
router.post('/sign-in', async function(req, res, next) {

  res.json('sign in');
});

/* User sign-up */
router.post('/sign-up', async function(req, res, next) {

  let newUser = new userModel ({
    token: uid2(32),
    creationDate: req.body.creationDate,
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    email: req.body.email,
    password: req.body.password,
    ads: req.body.ads
  });

  let user = await newUser.save();

  console.log(user);

  res.json(user);
});

/* GET offers */
router.get('/offers', async function(req, res, next) {

  let userToFind = await userModel.findOne({ token:req.body.token });

  adModel.aggregate([
    { $unwind: "$offers" },
    { $match: { 'offers.user' : userToFind._id } }
  ]).exec((err, result) => {
    res.json(result);
  });

});

/* GET visites */
router.get('/timeslots', async function(req, res, next) {

  let userToFind = await userModel.findOne({ token:req.body.token });

  adModel.aggregate([
    { $unwind: "$timeSlots" },
    { $match: { 'timeSlots.user' : userToFind._id } }
  ]).exec((err, result) => {
    res.json(result);
  });

});

/* POST offer */
router.put('/ad', async function(req, res, next) {

  let offer = {
    user: req.body.user,
    amount: req.body.amount
  }

  let newOffer = await adModel.updateOne(
      { _id: req.body.id }, 
      { $push: { offers: offer } }
  );

  res.json(newOffer);

});

/* POST visite */
router.put('/ad', async function(req, res, next) {

    let userToFind = await userModel.findOne({ token:req.body.token });

    timeslotId = mongoose.Types.ObjectId( req.body.timeslot )

    console.log( tags )

    adModel.updateOne( 
        { 'timeSlots._id': timeslotId },
        { $pushAll: { 'timeSlots.$': userToFind._id } }
    ).exec()
    .then( function ( result ) { 
        console.log( result )
        resolve( result )
        res.json(result);

    }, function ( error ) {
        if ( error ) return reject( error )
    })



  // let newVisit = await adModel.updateOne(
  //     { _id: req.body.id, "timeSlots._id" : req.body.timeslot }, 
  //     { $push: {"timeSlot.$.user":userToFind._id} }
  // );


});

module.exports = router;