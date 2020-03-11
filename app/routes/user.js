var express = require('express');
var router = express.Router();
var mongoose = require('../models/bdd');

var userModel = require('../models/userModel.js')
var adModel = require('../models/adModel.js')

const ObjectId = mongoose.Types.ObjectId;

var uid2 = require("uid2");
const jwt = require('jsonwebtoken')
const JWTPrivateKey = "n4opQ61HEDNPkLw9xBOdGTw92CTKgcrx" 
const bcrypt = require('bcryptjs');
const saltRounds = 12;

const generateToken = () => { // it is possible to add data (payload) by adding an argument to the function -- see doc
  u = {} //payload data
  return token = jwt.sign(u, JWTPrivateKey, {
    expiresIn: 60 // 24h 60 * 60 * 24
  })
}

let status;
let response;


/* Check token to access app*/
router.get('/user-access', async function(req, res, next) {

  let findUser = await userModel.findOne({ token:req.headers.token });
  
  try {

    if(!findUser) { 
      status = 401;
      response = {
        message: 'Bad token',
        details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
      };
    } else {
      status = 200;
      response = {
        message: 'OK',
        data: {
          ads: findUser.ads,
          token: findUser.token
        }
      }
    }

  } catch(e) {
    status = 500;
    response = {
      message: 'Internal error',
      details: 'Le serveur a rencontré une erreur.'
    };
  }

  res.status(status).json(response);
})


/* USER sign-in */
router.post('/sign-in', async function(req, res, next) {

  try {

    if( ['null', ''].indexOf(req.body.email) > 0 || ['', 'null'].indexOf(req.body.password) > 0 ) {
      status = 401;
      response = {
        message: 'Form error',
        details: 'Veuillez remplir tous les champs'
      }
    } else {

      const findUser = await userModel.findOne({ email:req.body.email });
      if(findUser === null) {
        status = 401;
        response = {
          message: 'Authentification error',
          details: "L'email ou le mot de passe fournis sont incorrects"
        }
      } else {
        const pwdMatch = await bcrypt.compare(req.body.password, findUser.password);
        if (pwdMatch) {
          status = 200;
          response = {
            message: 'OK',
            data: {
              ads: findUser.ads,
              token: findUser.token
            }
          }
        } else {
          status = 401;
          response = {
            message: 'Authentification error',
            details: "L'email ou le mot de passe fournis sont incorrects"
          }
        }   
      }
    }

  } catch(e) {
    status = 500;
    response = {
      message: 'Internal error',
      details: 'Le serveur a rencontré une erreur.'
    };
  }

  res.status(status).json(response);
});

/* USER sign-up */
router.post('/sign-up', async function(req, res, next) {

  try {

    if(['null', ''].indexOf(req.body.email) > 0 || ['', 'null'].indexOf(req.body.password) > 0 ) {
      status = 401;
      response = {
        message: 'Form error',
        details: 'Veuillez remplir tous les champs'
      }
    } else {

      const findUser = await userModel.findOne({
        email: req.body.email
      })

      if(findUser != null){
        status = 401;
        response = {
          message: 'User already exists',
          details: 'Cet utilisateur existe déjà'
        }
      } else {
        var hash = await bcrypt.hash(req.body.password, saltRounds)
        /* Création user */
        const newUser = new userModel({
          creationDate: new Date,
          lastname: req.body.lastname,
          firstname: req.body.firstname,
          email: req.body.email,
          password: hash,
          token: generateToken()
        })

        saveUser = await newUser.save()

        console.log(saveUser)
        status = 200;
        response = {
          message: 'OK',
          data: {
            token: saveUser.token
          }
        }
      }
    }

  } catch(e) {
    status = 500;
    response = {
      message: 'Internal error',
      details: 'Le serveur a rencontré une erreur.'
    };
  }

  res.status(status).json(response);
  
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