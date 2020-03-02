var express = require('express');
var router = express.Router();

var agentModel = require('../models/agentModel.js')
var adModel = require('../models/adModel.js')


// var request = require('sync-request');
// var uid2 = require("uid2");

// var userModel = require('../models/users');

// var bcrypt = require('bcrypt');
// const saltRounds = 10;

/* ProUser sign-in */
router.post('/sign-in', async function(req, res, next) {

  res.json('sign in');
});

/* ProUser sign-up */
router.post('/sign-up', async function(req, res, next) {

  res.json('sign up');
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


module.exports = router;
