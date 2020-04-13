const express = require('express')
const router = express.Router()

var mongoose = require('../models/bdd')
const userModel = require('../models/userModel.js')
const adModel = require('../models/adModel.js')

const {success, created, badRequest, unauthorized, forbidden, notFound, internalError} = require('./http-responses')

const mailjet = require ('node-mailjet')
  .connect('6e4a0426294486d548136359fc341ef6', 'bd0d46e4638b9c6ce22a79f46717b440')

require('dotenv').config()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const saltRounds = 12

let resp
let login_duration = 60 //30 minutes

/* --------------------------------------------------TOKEN GENERATION & CHECK--------------------------------------------------------- */
const generateUserAccessToken = (userInfo, minutes) => { 
  return jwt.sign(userInfo, process.env.JWT_USER_ACCESS_KEY, {
    expiresIn: 60 * minutes // 60sec * 30min
  })
}


const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization
  let accessToken = authHeader && authHeader.split(' ')[1]

  if (accessToken === null || !req.cookies.uRT) {  //if no token
    resp = unauthorized()
    res.status(resp.status).json(resp.response)
  
  } else {
    jwt.verify(accessToken, process.env.JWT_USER_ACCESS_KEY, async (err, userInfo) => {
      if (err) {  //if access token is not valid
        resp = unauthorized()
        res.status(resp.status).json(resp.response)

      } else {
        const currentTime = Math.round((new Date()).getTime() / 1000)
        const tokenExpiresIn = userInfo.exp - currentTime
        
        if (tokenExpiresIn < 900) { // if token expires in less than 15 minutes, try to update it
          const findUser = await userModel.findOne({ token:req.cookies.uRT })
          if (!findUser) { // if refresh token is not valid
            resp = unauthorized()
            res.status(resp.status).json(resp.response)
          
          } else {
            userInfo = {
              lastname: findUser.lastname,
              firstname: findUser.firstname,
              email: findUser.email,
              id: findUser._id
            }
            accessToken = generateUserAccessToken(userInfo, login_duration)
          }
        }

        resp = success(accessToken, {userInfo})
        req.accessToken = accessToken
        req.userInfo = userInfo
        next()
      }
    })
  }

}

/* --------------------------------------------------ACCESS / SIGN IN / SIGN UP--------------------------------------------------------- */
/* Check token to access app*/
router.get('/user-access', authenticateUser, async function(req, res) {
  
  // if authenticateUser don't block, then authenticate user
  res.status(resp.status).json(resp.response)
})


/* Logout to remove refresh token */
router.get('/logout', async function(req,res) {

  try {

    await userModel.updateOne(
      { token: req.cookies.uRT }, 
      { $unset: { token: null } }
    )

    resp = success('', {})
    res.clearCookie('uRT', {path:'/'})

  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})

/* USER sign-in */
router.post('/sign-in', async function(req, res, next) {

  let refreshCookie

  try {

    if( ['null', ''].indexOf(req.body.email) > 0 || ['', 'null'].indexOf(req.body.password) > 0 ) {
      resp = badRequest('Veuillez remplir tous les champs du formulaire')

    } else {
      const findUser = await userModel.findOne({ email:req.body.email })
      if(!findUser) {
        resp = badRequest('L\'adresse email et/ou le mot de passe sont incorrects')

      } else {
        const pwdMatch = await bcrypt.compare(req.body.password, findUser.password)
        if (!pwdMatch) {
          resp = badRequest('L\'adresse email et/ou le mot de passe sont incorrects')

        } else {
          /* Update refresh token */
          const refreshToken = jwt.sign({}, process.env.JWT_USER_REFRESH_KEY)
          await userModel.updateOne(
            {_id: findUser._id},
            {$set: {token: refreshToken}}
          )

          const userInfo = {
            lastname: findUser.lastname,
            firstname: findUser.firstname,
            email: findUser.email,
            id: findUser._id
          }

          if (req.body.stayLoggedIn === 'true') {
            login_duration = 60 * 24 * 365 // stay login for a year
          }

          refreshCookie = refreshToken
          resp = success(
            generateUserAccessToken(userInfo, login_duration),
            {userInfo}
          )
        }   
      }
    }

  } catch(e) {
    resp = internalError()
  }
  res.cookie('uRT', refreshCookie, {httpOnly: true, path:'/'})
  res.status(resp.status).json(resp.response)
})

/* USER sign-up */
router.post('/sign-up', async function(req, res, next) {

  let refreshCookie

  try {

    if(['null', ''].indexOf(req.body.email) > 0 || ['', 'null'].indexOf(req.body.password) > 0 || ['', 'null'].indexOf(req.body.firstname) > 0 || ['', 'null'].indexOf(req.body.lastname) > 0) {
      resp = badRequest('Veuillez remplir tous les champs du formulaire')

    } else {
      const findUser = await userModel.findOne({email: req.body.email})
      if(findUser){
        resp = badRequest('Un compte est déjà enregistré avec cette adresse email')

      } else {
        const refreshToken = jwt.sign({}, process.env.JWT_USER_REFRESH_KEY)
        var hash = await bcrypt.hash(req.body.password, saltRounds)
        /* Création user */
        const newUser = new userModel({
          creationDate: new Date,
          lastname: req.body.lastname,
          firstname: req.body.firstname,
          email: req.body.email,
          password: hash,
          token: refreshToken
        })

        saveUser = await newUser.save()

        /* Envoi de l'email de confirmation*/

        const url = `http://localhost:3001/confirmation/${refreshToken}`

        const request = await mailjet
        .post("send", {'version': 'v3.1'})
        .request({
          "Messages":[
            {
              "From": {
                "Email": "augustin.demaintenant@gmail.com",
                "Name": "Augustin"
              },
              "To": [
                {
                  "Email": req.body.email,
                  "Name": req.body.firstname
                }
              ],
              "Subject": "Bienvenue sur la plateforme TTM !",
              "TextPart": "My first Mailjet email",
              "HTMLPart": `<h3>Cher ${req.body.firstname}, Bienvenue sur TTM ! </h3><p>Veuillez confirmer votre email en cliquant sur le lien ci-dessous :</p><a href=${url}>${url}</a>`,
              "CustomID": "AppGettingStartedTest"
            }
          ]
        })

        const userInfo = {
          lastname: saveUser.lastname,
          firstname: saveUser.firstname,
          email: saveUser.email,
          id: saveUser._id
        }
        refreshCookie = refreshToken
        resp = created(
          generateUserAccessToken(userInfo, login_duration),
          {userInfo}
        )
      }
    }

  } catch(e) {
    resp = internalError()
  }

  res.cookie('uRT', refreshCookie, {httpOnly: true, path:'/'})
  res.status(resp.status).json(resp.response)
})

/* -----------------------------------------------AD DESC------------------------------------------ */
/* GET public ad  */ 
router.get('/ad/:ad_id/public', async function(req, res, next) {

  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.ad_id)) { // send a 404 if ad_id has not a id format
      resp = notFound()
    } else {

      let adFromDb = await adModel.findById(req.params.ad_id)
      if(!adFromDb) { 
        resp = internalError()

      } else {
        adFromDb.timeSlots = []
        adFromDb.offers = []
        resp = success('', {ad: adFromDb})
      }
    }
    
  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})

/* -----------------------------------------------SAVE AD FOR USER------------------------------------------ */
/* ADD ad id in user's table */
router.put('/ad/:ad_id', authenticateUser, async function(req, res) {

  try {

    let adExist = await adModel.findById(req.params.ad_id)
    if (adExist) {
      let findAd = await userModel.findOne({ _id : req.userInfo.id, 'ads': req.params.ad_id })
      if(!findAd) { 
        await userModel.updateOne(
          { _id : req.userInfo.id },
          { $push : { 'ads' : req.params.ad_id } }
        )
        resp = success(req.accessToken, {message: 'Cette annonce a été sauvegardée dans vos biens consultés'})

      } else {
        resp = success(req.accessToken, {})
      }
    } else {
      resp = notFound()
    }

  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})

/* GET ad for a user only with its visit and offer  */ 
router.get('/ad/:ad_id/private', authenticateUser, async function(req, res) {

  try {

    const adsFromUser = await userModel
      .findById(req.userInfo.id)
      .populate('ads')
      .exec()

    let ad = adsFromUser.ads.filter(e => e._id.toString() === req.params.ad_id)[0]

    let visits = ad.timeSlots.filter( f => {
      if (f.user.length > 0) {
        let users = f.user.map( g => {return g.toString()})
        if (users.indexOf(adsFromUser._id.toString()) > -1) {
          f.user = adsFromUser._id 
          
        } else {
          f = null
        }

        return f
      }
    })
    ad.timeSlots = visits

    let offers = ad.offers.filter( g => {
      return String(g.user) === String(adsFromUser._id)
    })
    ad.offers = offers
    
    resp = success(req.accessToken, {ad})

  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})


/* -----------------------------------------------GET ALL USER ADS------------------------------------------ */
/* GET ads for a user with its timeslots and offers */
router.get('/ads', authenticateUser, async function(req, res) {

  try {

    const adsFromUser = await userModel
      .findById(req.userInfo.id)
      .populate('ads')
      .exec()

    adsFromUser.ads.forEach( e => {      //filter timeslots and offers to only keep user's ones

      let visits = e.timeSlots.filter( f => {
        if (f.user.length > 0) {
          let users = f.user.map( g => {return g.toString()})
          if (users.indexOf(adsFromUser._id.toString()) > -1) {
            f.user = adsFromUser._id 

          } else {
            f = null
          }

          return f
        }
      })
      e.timeSlots = visits

      let offers = e.offers.filter( g => {
        return String(g.user) === String(adsFromUser._id)
      })
      e.offers = offers

    })

    resp = success(req.accessToken, {ads: adsFromUser.ads})

  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})

/* -----------------------------------------------GET, POST OFFERS------------------------------------------ */
/* GET offers */
// router.get('/offers', async function(req, res, next) {

//   let userToFind = await userModel.findOne({ token:req.headers.token })

//   adModel.aggregate([
//     { $unwind: "$offers" },
//     { $match: { 'offers.user' : userToFind._id } }
//   ]).exec((err, result) => {
//     res.json(result)
//   })

// })


/* POST offer */
router.post('/ad/:ad_id/offer', authenticateUser, async function(req, res) {

  try {

    let offer = {
      creationDate: req.body.creationDate,
      status: 'pending',
      user: req.userInfo.id,
      singleBuyer: req.body.singleBuyer,
      lastName1: req.body.lastName1,
      firstName1: req.body.firstName1,
      lastName2: req.body.lastName2,
      firstName2: req.body.firstName2,
      address: req.body.address,
      postCode: req.body.postCode,
      city: req.body.city,
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
      comments: req.body.comments
    }

    let newOffer = await adModel.updateOne(
        { _id: req.params.ad_id }, 
        { $push: { offers: offer } }
    )

    resp = created(req.accessToken, {offer: newOffer})
  
  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})


/* -----------------------------------------------TIMESLOTS------------------------------------------ */
/* GET available timeslots for an ad */
router.get('/ad/:ad_id/timeslots', authenticateUser, async function(req,res) {

  try {
  
    let adFromDb = await adModel.findById(req.params.ad_id)

    if(!adFromDb) { 
      resp = notFound()

    } else {
      resp = success(req.accessToken, {timeslots: adFromDb.timeSlots})
    }

   } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})


/* PUT timeslot : book a timeslot for a visit */
router.put('/ad/:ad_id/timeslots/:timeslot_id', authenticateUser, async function(req, res) {

  try {

    await adModel.updateOne(
      { _id: req.params.ad_id, "timeSlots._id": req.params.timeslot_id }, 
      { $set: { 'timeSlots.$.booked' : true }, $push: { 'timeSlots.$.user' : req.userInfo.id } }
    )
    resp = success(req.accessToken, {})

  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})

/* Delete timeslots : cancel visit */
router.delete('/ad/:ad_id/timeslots/:timeslot_id', authenticateUser, async function(req,res) {

  try {

    // Check timeslot if booking status needs to be updated
    let bookingStatus = false

    let adFromDb = await adModel.findById(req.params.ad_id)
    let timeslot = adFromDb.timeSlots.filter (e => e._id == req.params.timeslot_id)

    // refresh user for timeslot
    const newUsers = timeslot[0].user.filter(e => e != req.userInfo.id) 

    // keep timeslot booked if other users have booked it
    if (newUsers.length > 0) {
      bookingStatus = true
    }

    //DB update
    await adModel.updateOne(
      { _id: req.params.ad_id, "timeSlots._id": req.params.timeslot_id }, 
      { $set: { 'timeSlots.$.booked' : bookingStatus, 'timeSlots.$.user' : newUsers } }
    )

    resp = success(req.accessToken, {})

  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})

/* -----------------------------------------------QUESTIONS------------------------------------------ */
/* POST question */
router.post('/ad/:ad_id/question', authenticateUser, async function(req, res) {

  try {

    let question = {
      creationDate: new Date,
      status: 'pending',
      question: req.body.question,
      user: req.userInfo.id
    }

    await adModel.updateOne(
        { _id: req.params.ad_id }, 
        { $push: { questions: question } }
    )

    resp = created(req.accessToken, {})
  
  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})

module.exports = router