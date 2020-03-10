var express = require('express');
var router = express.Router();
var mongoose = require('../models/bdd');

var userModel = require('../models/userModel.js')
var adModel = require('../models/adModel.js')

// var request = require('sync-request');
var uid2 = require("uid2");


// var bcrypt = require('bcrypt');
// const saltRounds = 10;

const ObjectId = mongoose.Types.ObjectId;

var adIdTest = '5e5cf133e1a25d0b8a9805bd';

var userIdTest1 = '5e5cf93759f38b0e11fc0ad5';
var userIdTest2 = '5e5cfbe96c8d820efe85ad45';
var userIdTest3 = '5e5cfbf96c8d820efe85ad46';

let status;
let response;

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

<<<<<<< HEAD
/* GET ads */
router.get('/ads', async function(req, res, next){

  const adsFromUser = await userModel
    .findOne({ token:req.headers.token })
    .populate('ads')
    .exec()

  try {

    if(!adsFromUser) { 
      status = 401;
      response = {
        message: 'Bad token',
        details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
      };
    } else {

      adsFromUser.ads.forEach( e => {
        let visits = e.timeSlots.filter( f => {
          return f.user.indexOf(adsFromUser._id) > -1
        })
        let offers = e.offers.filter( g => {
          return String(g.user) === String(adsFromUser._id)
        })
        e.timeSlots = visits
        e.offers = offers
      })

      status = 200;
      response = {
        message: 'OK',
        data: {
          ads: adsFromUser.ads,
          token: adsFromUser.token
        }
      }
    };

  } catch(e) {
=======
/* GET ad  */
router.get('/ad/:id', async function(req, res, next) {

  try {
    let ad = await adModel.findById(req.params.id)
    status = 200;
    response = ad  
    }

   catch(e) {
>>>>>>> 1a73e6b6a7e954f8ff499e0b7192e5cbee4d7e12
    status = 500;
    response = {
      message: 'Internal error',
      details: 'Le serveur a rencontré une erreur.'
    };
  }

  res.status(status).json(response);

<<<<<<< HEAD
})
=======
});
>>>>>>> 1a73e6b6a7e954f8ff499e0b7192e5cbee4d7e12

/* GET offers */
router.get('/offers', async function(req, res, next) {

  let userToFind = await userModel.findOne({ token:req.headers.token });

  adModel.aggregate([
    { $unwind: "$offers" },
    { $match: { 'offers.user' : userToFind._id } }
  ]).exec((err, result) => {
    res.json(result);
  });

});

/* GET visites */
router.get('/ad/visit', async function(req, res, next) {

  let userToFind = await userModel.findOne({ token:req.body.token });

  adModel.aggregate([
    { $unwind: "$timeSlots" },
    { $match: { 'timeSlots.user' : userToFind._id } }
  ]).exec((err, result) => {
    res.json(result);
  });

});

/* POST offer */
router.put('/ad/:id_ad/offer', async function(req, res, next) {

  let userToFind = await userModel.findOne({ token:req.body.token });

  let offer = {
    creationDate: new Date,
    status: 'pending',
    user: userToFind._id,
    singleBuyer: req.body.singleBuyer,
    lastname1: req.body.lastname1,
    firstname1: req.body.firstname1,
    lastname2: req.body.lastname2,
    firstname2: req.body.firstname2,
    amount: req.body.amount,
    loan: req.body.loan,
    loanAmount: req.body.loanAmount,
    contributionAmount: req.body.contributionAmount,
    monthlyPay: req.body.monthlyPay,
    notary: req.body.notary,
    notaryName: req.body.notaryName,
    notaryAddress: req.body.notaryAddress,
    notaryEmail: req.body.notaryEmail,
    validityPeriod: req.body.validityPeriod,
    location: req.body.location,
    message: req.body.message
  }

  let newOffer = await adModel.updateOne(
      { _id: req.params.id_ad }, 
      { $push: { offers: offer } }
  );

  res.json(newOffer);

});

/* POST visite */
router.put('/ad/visit', async function(req, res, next) {

    let userToFind = await userModel.findOne({ token:req.body.token });

    let newVisit = await adModel.updateOne(
      { _id: req.body.ad, "timeSlots._id": req.body.timeslot }, 
      { $set: { 'timeSlots.$.booked' : true }, $push: { 'timeSlots.$.user' : userToFind._id } }
    )
    res.json(newVisit)

});

module.exports = router;