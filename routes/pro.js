var express = require('express')
var router = express.Router()
var fs = require('fs').promises

var mongoose = require('../models/bdd')
var agencyModel = require('../models/agencyModel.js')
var agentModel = require('../models/agentModel.js')
var adModel = require('../models/adModel.js')

const {success, created, badRequest, unauthorized, forbidden, notFound, internalError} = require('./http-responses')

var cloudinary = require('cloudinary').v2
const path = require('path')

require('dotenv').config()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const saltRounds = 12

const uuid = require('uuid').v4

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_PUBLIC_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET_KEY
})

const agencyID = "5e6222aa670cd85f2fb6ba51" // temporaire le temps de gérer les agences

const checkEmail = email => {
  const regexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  return email.match(regexp) ? true : false
}

let status
let response
let resp
let login_duration = 60 //60 minutes

/* --------------------------------------------------TOKEN GENERATION & CHECK--------------------------------------------------------- */
const generateAgentAccessToken = (agentInfo, minutes) => { 
  return jwt.sign(agentInfo, process.env.JWT_AGENT_ACCESS_KEY, {
    expiresIn: 60 * minutes // 60sec * minutes
  })
}


const authenticateAgent = (req, res, next) => {
  const authHeader = req.headers.authorization
  let accessToken = authHeader && authHeader.split(' ')[1]

  if (accessToken === null || !req.cookies.aRT) {  //if no token 
    resp = unauthorized()
    res.status(resp.status).json(resp.response)

  } else {
    jwt.verify(accessToken, process.env.JWT_AGENT_ACCESS_KEY, async (err, agentInfo) => {
      if (err) {  //if access token is not valid
        resp = unauthorized()
        res.status(resp.status).json(resp.response)

      } else {
        const currentTime = Math.round((new Date()).getTime() / 1000)
        const tokenExpiresIn = agentInfo.exp - currentTime

        if (tokenExpiresIn < 900) { // if token expires in less than 15minutes, try to update it
          const findAgent = await agentModel.findOne({ token:req.cookies.aRT })
          if (!findAgent) { // if refresh token is not valid
            resp = unauthorized()
            res.status(resp.status).json(resp.response)

          } else {
            agentInfo = {
              lastname: findAgent.lastname,
              firstname: findAgent.firstname,
              email: findAgent.email,
              id: findAgent._id
            }
            accessToken = generateAgentAccessToken(agentInfo, login_duration)
          }
        }

        resp = success(accessToken, {agentInfo})

        req.accessToken = accessToken
        req.agentInfo = agentInfo
        next()
      }
    })
  }
}

/* --------------------------------------------------ACCESS / SIGN IN / SIGN UP--------------------------------------------------------- */
/* Check token to access app*/
router.get('/user-access', authenticateAgent, async function(req, res) {
  
  // if authenticateAgent don't block, then authenticate user
  res.status(resp.status).json(resp.response)
})

/* Logout to remove refresh token */
router.get('/logout', async function(req,res) {

  try {

    await agentModel.updateOne(
      { token: req.cookies.aRT }, 
      { $unset: { token: null } }
    )

    resp = success('', {})
    res.clearCookie('aRT', {path:'/pro'})

  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})

/* PRO sign-in */
router.post('/sign-in', async function(req, res) {

  let refreshCookie

  try {

    if( ['null', ''].indexOf(req.body.email) > -1 || ['', 'null'].indexOf(req.body.password) > -1 ) {
      resp = badRequest('Veuillez remplir tous les champs du formulaire')

    } else {
      if (!checkEmail(req.body.email)) {
        resp = badRequest('Merci de fournir une adresse email valide')

      } else {

        const findAgent = await agentModel.findOne({ email:req.body.email })
        if(!findAgent) {
          resp = badRequest('L\'adresse email et/ou le mot de passe sont incorrects')

        } else {
          const pwdMatch = await bcrypt.compare(req.body.password, findAgent.password)
          if (!pwdMatch) {
            resp = badRequest('L\'adresse email et/ou le mot de passe sont incorrects')
          } else {

            /* Update refresh token */
            const refreshToken = jwt.sign({}, process.env.JWT_AGENT_REFRESH_KEY)
            await agentModel.updateOne(
              {_id: findAgent._id},
              {$set: {token: refreshToken}}
            )

            const agentInfo = {
              lastname: findAgent.lastname,
              firstname: findAgent.firstname,
              email: findAgent.email,
              id: findAgent._id
            }

            if (req.body.stayLoggedIn === 'true') {
              login_duration = 60 * 24 * 365 // stay login for a year
            }

            refreshCookie = refreshToken
            resp = success(
              generateAgentAccessToken(agentInfo, login_duration),
              {agentInfo}
            )
          }  
        }
      }
    }

  } catch(e) {
    resp = internalError()
  }
  res.cookie('aRT', refreshCookie, {httpOnly: true, path:'/pro'})
  res.status(resp.status).json(resp.response)
})

/* PRO sign-up */
router.post('/sign-up', async function(req, res) {

  let refreshCookie

  try {

    if(['null', ''].indexOf(req.body.email) > -1 || ['', 'null'].indexOf(req.body.password) > -1 ) {
      resp = badRequest('Veuillez remplir tous les champs du formulaire')

    } else {
      if (!checkEmail(req.body.email)) {
        resp = badRequest('Merci de fournir une adresse email valide')

      } else {
        const findAgent = await agentModel.findOne({
          email: req.body.email
        })

        if(findAgent){
          resp = badRequest('Un compte est déjà enregistré avec cette adresse email')

        } else {
          const refreshToken = jwt.sign({}, process.env.JWT_AGENT_REFRESH_KEY)
          const hash = await bcrypt.hash(req.body.password, saltRounds)
          /* Création agent */
          const newAgent = new agentModel({
            // admin: req.body.admin,
            lastname: req.body.lastname,
            firstname: req.body.firstname,
            email: req.body.email,
            password: hash,
            token: refreshToken
          })

          saveAgent = await newAgent.save()

          /* Rattachement à l'agence */
          await agencyModel.updateOne(
            { _id: agencyID }, 
            { $push: { agents : saveAgent._id } }
          )

          /* Réponse */
          const agentInfo = {
            lastname: saveAgent.lastname,
            firstname: saveAgent.firstname,
            email: saveAgent.email,
            id : saveAgent._id
          }
          refreshCookie = refreshToken
          resp = created(
            generateAgentAccessToken(agentInfo, login_duration),
            {agentInfo}
            )
        }
      }
    }

  } catch(e) {
    resp = internalError()
  }

  res.cookie('aRT', refreshCookie, {httpOnly: true, path:'/pro'})
  res.status(resp.status).json(resp.response)
})

/* --------------------------------------------------LIST ALL ADS FOR AN AGENT--------------------------------------------------------- */
/* GET PRO ads */
router.get('/ads', authenticateAgent, async function(req, res) {

  try {
    let adsFromAgent = await agentModel.findOne({ _id:req.agentInfo.id })
      .populate('ads')
      .exec()

    resp = success(
      req.accessToken, 
      {ads: adsFromAgent.ads}
    )
    
  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})

/* --------------------------------------------------GET, POST UPDATE AND DELETE AN AD--------------------------------------------------------- */

/* GET Ad details */
router.get('/ad/:ad_id', authenticateAgent, async function(req, res) {

  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.ad_id)) { // send a 404 if ad_id has not a id format
      resp = notFound()
    } else {

      let adFromDb = await adModel.findById(req.params.ad_id)
      if(!adFromDb) { 
        resp = notFound()

      } else {
        adFromDb.timeSlots = []
        adFromDb.offers = []
        resp = success(
          req.accessToken,
          {ad: adFromDb}
        )
      }
    }
  
  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})


/* POST ad */
router.post('/ad', authenticateAgent, async function(req, res) {

  try {

    let adId = req.body.adID
    let photosToSave = []
    let filesToSave = []

    let photos = req.body.photos
    for (let i=0 ; i< photos.length ; i++) {
      
      // Upload photos in Cloudinary 
      const resultCloudinary = await cloudinary.uploader.upload(`./temp/${adId}/${photos[i].id}${photos[i].extension}`, {
        use_filename: true, 
        unique_filename: false
      })
      photosToSave.push({
        externalId: photos[i].id,
        name: photos[i].name,
        extension: photos[i].extension,
        url: resultCloudinary.url
      })
      
      // Delete photos from temp folder
      await fs.unlink(`./temp/${adId}/${photos[i].id}${photos[i].extension}`) 
    }

    let files = req.body.files
    for(let i=0 ; i < files.length ; i++) {
      
      // Upload docs in Cloudinary 
      const resultCloudinary = await cloudinary.uploader.upload(`./temp/${adId}/${files[i].id}${files[i].extension}`, {
        use_filename: true, 
        unique_filename: false
      })
      filesToSave.push({
        externalId: files[i].id,
        name: files[i].name,
        extension: files[i].extension,
        url: resultCloudinary.url
      })

      // Delete docs from temp folder
      await fs.unlink(`./temp/${adId}/${files[i].id}${files[i].extension}`) 
    }


    let timeslots = req.body.timeSlots
    timeslots.forEach(e => e.agent = req.agentInfo.id)

    let newAd = new adModel ({
      creationDate: new Date,
      color: req.body.color,
      onlineStatus: true,
      offerStatus: false,
      visitStatus: false,
      price: req.body.price,
      fees: req.body.fees,
      feesPayer: req.body.feesPayer,
      type: req.body.type,
      title: req.body.title,
      description: req.body.description,
      typeAddress: req.body.typeAddress,
      address: req.body.address,
      postcode: req.body.postcode,
      city: req.body.city,
      photos: photosToSave,
      video: req.body.video,
      area: req.body.area,
      rooms: req.body.rooms,
      bedrooms: req.body.bedrooms,
      advantages : req.body.advantages,
      options: req.body.options,
      dpe: req.body.dpe,
      ges: req.body.ges,
      files: filesToSave,
      timeSlots: timeslots
    })

    await newAd.save()
  
    await agentModel.updateOne(
      { _id: mongoose.Types.ObjectId(req.agentInfo.id) }, 
      { $push: { ads : newAd._id } }
    )

    resp = created(
      req.accessToken,
      {newAd}
    )
    
  } catch(e) {
      resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})

/* UPDATE ad  */
router.put('/ad/:ad_id', authenticateAgent, async function(req, res) {

  try {

      let adId = req.body.adID
      let photosToSave = []
      let filesToSave = []

      let photos = req.body.photos  
      for (let i=0 ; i<photos.length ; i++) {

        // Upload new photos in Cloudinary
        const resultCloudinary = await cloudinary.uploader.upload(`./temp/${adId}/${photos[i].id}${photos[i].extension}`, {
          use_filename: true,
          unique_filename: false
        })
        photosToSave.push({
          externalId: photos[i].id,
          name: photos[i].name,
          extension: photos[i].extension,
          url: resultCloudinary.url
        })

        // Delete photos from temp folder
        await fs.unlink(`./temp/${adId}/${photos[i].id}${photos[i].extension}`)
      }

      photosToSave = [...photosToSave, ...req.body.photosDB]
  

      let files = req.body.files
      for (let i=0 ; i < files.length ; i++) {

        // Upload docs in Cloudinary
        var resultCloudinary = await cloudinary.uploader.upload(`${adId}/${files[i].id}${files[i].extension}`, {
          use_filename: true,
          unique_filename: false
        })
        filesToSave.push({
          externalId: files[i].id,
          name: files[i].name,
          extension: files[i].extension,
          url: resultCloudinary.url
        })

        // Delete docs from temp folder
        await fs.unlink(`./temp/${adId}/${files[i].id}${files[i].extension}`) 
      }

      filesToSave = [...filesToSave, ...req.body.filesDB]

    await adModel.updateOne(
      { _id: req.params.ad_id }, 
      { 
        color: req.body.color,
        onlineStatus: true,
        offerStatus: false,
        visitStatus: false,
        price: req.body.price,
        fees: req.body.fees,
        feesPayer: req.body.feesPayer,
        type: req.body.type,
        title: req.body.title,
        description: req.body.description,
        typeAddress: req.body.typeAddress,
        address: req.body.address,
        postcode: req.body.postcode,
        city: req.body.city,
        photos: photosToSave,
        video: req.body.video,
        area: req.body.area,
        rooms: req.body.rooms,
        bedrooms: req.body.bedrooms,
        advantages : req.body.advantages,
        options: req.body.options,
        dpe: req.body.dpe,
        ges: req.body.ges,
        files: filesToSave,
        timeSlots: req.body.timeSlots
      }
    )

    resp = success(req.accessToken, {})

  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})

/* DELETE ad */
router.delete('/ad/:ad_id', authenticateAgent, async function(req, res) {

  try {

    // let findAd = await adModel.findById(req.params.ad_id) // get ad

    // format photos link to extract only the public ID of photos
    let formatPhotos = findAd.photos.map(e => 
      e.url.split('upload/')[1].split('/')[1].split('.')[0]
    )

    // delete photos from cloudinary
    for(let i=0 ; i<formatPhotos.length ; i ++) {  
      await cloudinary.uploader.destroy(formatPhotos[i])
    }

    // format files link to extract only the public ID of files
    let formatFiles = findAd.files.map( e =>
      e.url.split('upload/')[1].split('/')[1].split('.')[0]
    )
    

    // delete files from cloudinary
    for(let i=0 ; i<formatFiles.length ; i ++) {  
      await cloudinary.uploader.destroy(formatFiles[i])
    }

    //delete ad from DB
      await adModel.deleteOne({ _id: req.params.ad_id })

    // delete ad id from agent
    const findAgent = await agentModel.findById(req.agentInfo.id)
    let adsFromAgent = findAgent.ads

    adsFromAgent = adsFromAgent.filter(e => e._id != req.params.ad_id)

    await agentModel.updateOne(
        { _id: findAgent._id }, 
        { $set: { ads: adsFromAgent } }
    )

    resp = success(req.accessToken, {})

  } catch(e) {
    resp = internalError()
  }
  res.status(resp.status).json(resp.response)
})


/* UPDATE ad onlineStatus */
router.put('/ad/:ad_id/online', authenticateAgent, async function(req, res) {

  try {
    let updateAd = await adModel.updateOne(
      { _id: req.params.ad_id }, 
      { 
        onlineStatus: req.body.onlineStatus,
        onlineDate: new Date
      }
    )
    
    status = 200
    response = {
      message: 'OK',
      data: updateAd
    }

  } catch(e) {
    status = 500
    response = {
      message: 'Internal error',
      details: 'Le serveur a rencontré une erreur.'
    }
  }

  res.status(status).json(response)
})

/* --------------------------------------------------CALENDAR: CREATE, UPDATE AND DELETE TIMESLOTS--------------------------------------------------------- */

/* POST timeslot */
router.post('/ad/:ad_id/timeslots', authenticateAgent, async function(req, res) {

  try {

    let timeSlots = JSON.parse(req.body.timeslot)
    timeSlots = timeSlots.map(obj => {
      return { 
        booked: false,
        start: obj.start,
        end: obj.end,
        private: obj.private,
        agent: req.agentInfo.id
      }
    })

    let timeslotsFromBdd = await adModel.findById(req.params.ad_id)
    timeslotsFromBdd = timeslotsFromBdd.timeSlots

    const allTimeslots = timeslotsFromBdd.concat(timeSlots)

    await adModel.updateOne(
        { _id: req.params.ad_id }, 
        { $set: { timeSlots: allTimeslots }, visitStatus: true }
    )
    
    resp = created(req.accessToken, {})

  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})

/* PUT timeslot */
router.put('/ad/:ad_id/timeslot/:id_timeslot', authenticateAgent, async function(req, res) {

  try {

    let timeSlots = JSON.parse(req.body.timeslot)
    timeSlots = timeSlots.map(obj => {
      return { 
        booked: false,
        start: obj.start,
        end: obj.end,
        private: obj.private,
        agent: req.agentInfo.id
      }
    })

    let timeslotsFromBdd = await adModel.findById(req.params.ad_id)
    timeslotsFromBdd = timeslotsFromBdd.timeSlots

    timeslotsFromBdd = timeslotsFromBdd.filter(e => e._id != req.params.id_timeslot)

    let allTimeslots = timeslotsFromBdd.concat(timeSlots)

    await adModel.updateOne(
        { _id: req.params.ad_id }, 
        { $set: { timeSlots: allTimeslots }, visitStatus: true }
    )
    
    resp = success(req.accessToken, {})

  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})

/* DELETE timeslot */
router.delete('/ad/:ad_id/timeslot/:id_timeslot', authenticateAgent, async function(req, res) {

  try {
          
    let timeslotsFromBdd = await adModel.findById(req.params.ad_id)
    timeslotsFromBdd = timeslotsFromBdd.timeSlots

    timeslotsFromBdd = timeslotsFromBdd.filter(e => e._id != req.params.id_timeslot)

    await adModel.updateOne(
        { _id: req.params.ad_id }, 
        { $set: { timeSlots: timeslotsFromBdd } }
    )

    resp = success(req.accessToken, {})

  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})

/* -----------------------------------------OFFER: ACCEPT, DECLINE & CANCEL--------------------------------------------------------- */
/* PUT accept offer */
router.put('/ad/:ad_id/offer/:id_offer/accept', authenticateAgent, async function(req, res) {

  try {

    await adModel.updateOne(
      { _id: req.params.ad_id, "offers._id": req.params.id_offer  }, 
      { "offers.$.status": 'accepted' }
    )

    await adModel.updateMany(
      { _id: req.params.ad_id,"offers._id": req.params.id_offer },
      { $set: { "offers.$[elem].status" : 'declined' } },
      { arrayFilters: [ { "elem.status": 'pending' } ] }
    )

    resp = success(req.accessToken, {})

  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})

/* PUT decline offer */
router.put('/ad/:ad_id/offer/:id_offer/decline', authenticateAgent, async function(req, res) {

  try {

    await adModel.updateOne(
      { _id: req.params.ad_id, "offers._id": req.params.id_offer  }, 
      { "offers.$.status": 'declined' }
    )

    resp = success(req.accessToken, {})

  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})

/* CANCEL accepted offer */
router.put('/ad/:ad_id/offer/:id_offer/cancel', authenticateAgent, async function(req, res) {

  try {

    await adModel.updateOne(
      { _id: req.params.ad_id, "offers._id": req.params.id_offer  }, 
      { "offers.$.status": 'declined' }
    )

    await adModel.updateMany(
      { _id: req.params.ad_id, "offers._id": req.params.id_offer },
      { $set: { "offers.$[elem].status" : 'pending' } },
      { arrayFilters: [ { "elem.status": 'declined' } ] }
    )

    resp = success(req.accessToken, {})

  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})

/* -----------------------------------------GET POST AND DELETE DOCUMENTS----------------------------------------------------- */
/* GET files from Temp */
router.get('/ad/:ad_id/file/:file/temp', async function(req, res) {

  res.sendFile(path.join(__dirname, `../temp/${req.params.ad_id}/${req.params.file}`))

})


/* Upload files from form in temp folder */
router.post('/ad/:ad_id/file', authenticateAgent, async function(req, res) {

  const newPath = `./temp/${req.params.ad_id}`
  
  // Create folder for temp file
  try {
    await fs.mkdir(newPath)

  } catch(e) {
    if (e.code !== 'EEXIST') { // If folder does not exist and there is an error, send an error
      resp = internalError()
    }
  }

  // Move files to folder
  const regexp = /^.*\/(jpeg|png|pdf)/
  const fileExtension = '.' + req.files.file.mimetype.match(regexp)[1] // get file extension
  const fileId = uuid() // generate a unique ID for the file

  try {
    
    const resultCopy = await req.files.file.mv(`${newPath}/${fileId}${fileExtension}`)
    if(!resultCopy) {
      resp = success(req.accessToken,
        {file: {
          name: req.files.file.name,
          extension: fileExtension,
          id: fileId
        }}
      )
    } else {
      resp = internalError()
    }

  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})

/* DELETE files in temp folder  */
router.delete('/ad/:ad_id/file/:file/temp', authenticateAgent, async function(req, res) {

  try {
  
    await fs.unlink(`./temp/${req.params.ad_id}/${req.params.file}`)
    resp = success(req.accessToken, {})

  } catch(e) {
    resp = internalError()
  }
  
  res.status(resp.status).json(resp.response)
})

/* DELETE files in Cloudinary */
router.delete('/ad/:ad_id/file/:file/cloud', authenticateAgent, async function(req, res) {

  try {
    requestCloudinary = await cloudinary.uploader.destroy(`${req.params.file}`)
    if (requestCloudinary.result === 'not found'){
      resp = notFound()
    } else {
      resp = success(req.accessToken, {})
    }
  
  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})


/* -----------------------------------------------ANSWER QUESTIONS----------------------------------------------------- */
/* PUT answer question */
router.put('/ad/:ad_id/question/:id_question/answer', authenticateAgent, async function(req, res) {

  try {

    await adModel.updateOne(
      { _id: req.params.ad_id, "questions._id": req.params.id_question  }, 
      { "questions.$.status": 'answered', "questions.$.response": req.body.response }
    )

    resp = success(req.accessToken, {})

  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})

/* PUT decline question */
router.put('/ad/:ad_id/question/:id_question/decline', authenticateAgent, async function(req, res) {

  try {

    await adModel.updateOne(
      { _id: req.params.ad_id, "questions._id": req.params.id_question  }, 
      { "questions.$.status": 'declined', "questions.$.response": req.body.declineReason  }
    )

    resp = success(req.accessToken, {})

  } catch(e) {
    resp = internalError()
  }

  res.status(resp.status).json(resp.response)
})


module.exports = router