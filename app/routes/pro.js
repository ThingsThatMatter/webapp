var express = require('express');
var router = express.Router();
var fs = require('fs');


var agentModel = require('../models/agentModel.js')
var adModel = require('../models/adModel.js')



// var request = require('sync-request');
var uid2 = require("uid2");

// var userModel = require('../models/users');

// var bcrypt = require('bcrypt');
// const saltRounds = 10;


var agentIdTest = '5e5cf8e567fc720dcbcaadb3';

/* ProUser sign-in */
router.post('/sign-in', async function(req, res, next) {

  res.json('sign in');
});

/* ProUser sign-up */
router.post('/sign-up', async function(req, res, next) {

  let newAgent = new agentModel ({
    token: uid2(32),
    creationDate: req.body.creationDate,
    admin: req.body.admin,
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    email: req.body.email,
    password: req.body.password,
    ads: req.body.ads
  });

  let agent = await newAgent.save();

  console.log(agent);

  res.json(agent);
});


/* POST ad */
router.post('/ad', async function(req, res, next) {

  let newAd = new adModel ({
    creationDate: req.body.creationDate,
    onlineDate: req.body.onlineDate,
    color: req.body.color,
    onlineStatus: req.body.onlineStatus,
    offerStatus: req.body.offerStatus,
    visitStatus: req.body.visitStatus,
    price: req.body.price,
    fees: req.body.fees,
    type: req.body.type,
    title: req.body.title,
    description: req.body.description,
    address: req.body.address,
    postcode: req.body.postcode,
    city: req.body.city,
    photos: req.body.photos,
    video: req.body.video,
    area: req.body.area,
    rooms: req.body.rooms,
    bedrooms: req.body.bedrooms,
    elevator: req.body.elevator,
    terrace: req.body.terrace,
    balcony: req.body.balcony,
    options: req.body.options,
    dpe: req.body.dpe,
    ges: req.body.ges,
    files: req.body.files
  });

  let ad = await newAd.save();

  console.log(ad);

  res.json(ad);

});

/* POST timeslot */
router.put('/ad', async function(req, res, next) {

  let timeslot = {
    booked: req.body.booked,
    agent: req.body.agent,
    start: req.body.start,
    end: req.body.end
  }

  let newTimeslot = await adModel.update(
      { _id: req.body.id }, 
      { $push: { timeSlots: timeslot } }
  );

  res.json(newTimeslot);

});

/* GET timeslot */
router.get('/timeslots', async function(req, res, next) {

  let agentToFind = await agentModel.findOne({ token:req.body.token });

  adModel.aggregate([
    { $unwind: "$timeSlots" },
    { $match: { 'timeSlots.agent' : agentToFind._id } }
  ]).exec((err, result) => {
    res.json(result);
  });

});


/* GET ProUser ads */

router.get('/ads', async function(req, res, next) {

  let findUser = await agentModel.find({token : req.query.token}).populate('ads').exec() // authenticate user and return his ads

  res.json(findUser.ads);

});

// GET Ad details

router.get('/ad', async function(req, res, next) {

  let findUser = await agentModel.find({token : req.query.token})  // authenticate user


  let findAd = await adModel.findById(req.query.adId) // return add detail if user is authenticated

  res.json(findAd);

});
// GET ALL offers

router.get('/offers', async function(req, res, next) {

  let findUser = await agentModel.find({token : req.query.token}).populate('ads').exec() // authenticate user and return his ads

  // boucler sur le tableau d'annonces 


  res.json(findAd);
});

// POST Upload images in form 

router.post('/upload', async function(req, res, next) {

  console.log("token", req.body)
  console.log("fichier", req.files)
  
  var resultCopy = await req.files.file.mv(`./temp/${req.body.id}-${req.files.file.name}`);
  
  if(!resultCopy) {
    res.json({result: true, name: req.files.file.name, message: `${req.files.file.name} uploaded!`} );       
  } else {
    res.json({result: false, name: req.files.file.name, message: `couldn't upload ${req.files.file.name}`} );
  } 

});

router.delete('/upload', async function(req, res, next) {

  console.log(req.files)

  res.json("deleted")

});


module.exports = router;
