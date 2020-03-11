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

/* GET ads */
router.get('/ads', async function(req, res, next) {

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

      adsFromUser.ads.forEach( e => {      //filter timeslots and offers to only keep user's ones

        let visits = e.timeSlots.filter( f => {
          if (f.user.length > 0) {
            let users = f.user.map( g => {return g.toString()})
            if (users.indexOf(adsFromUser._id.toString()) > -1) {
              f.user = adsFromUser._id 
            } else {f = null}
            return f
          }
        })
        e.timeSlots = visits

        let offers = e.offers.filter( g => {
          return String(g.user) === String(adsFromUser._id)
        })
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
    status = 500;
    response = {
      message: 'Internal error',
      details: 'Le serveur a rencontré une erreur.'
    };
  }

  res.status(status).json(response);

})


/* GET ad  */ // Attention cet ad n'est pas utilisable partout : on ne récupère que les timeslots et offre du buyer
router.get('/ad/:id', async function(req, res, next) {

  const adsFromUser = await userModel
    .findOne({ token:req.headers.token })
    .populate('ads')
    .exec()

  // try {

    if(!adsFromUser) { 
      status = 401;
      response = {
        message: 'Bad token',
        details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
      };
    } else {

      const user = {
        lastname: adsFromUser.lastname,
        firstname: adsFromUser.firstname
      }

      let ad = adsFromUser.ads.filter(e => e._id.toString() === req.params.id)[0]

      let visits = ad.timeSlots.filter( f => {
        if (f.user.length > 0) {
          let users = f.user.map( g => {return g.toString()})
          if (users.indexOf(adsFromUser._id.toString()) > -1) {
            f.user = adsFromUser._id 
          } else {f = null}
          return f
        }
      })
      ad.timeSlots = visits

      let offers = ad.offers.filter( g => {
        return String(g.user) === String(adsFromUser._id)
      })
      ad.offers = offers
      

      status = 200;
      response = {
        message: 'OK',
        data: {
          ad: ad,
          user: user
        }
      }
    }


  // } catch(e) {
  //   status = 500;
  //   response = {
  //     message: 'Internal error',
  //     details: 'Le serveur a rencontré une erreur.'
  //   };
  // }

  res.status(status).json(response);


});

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