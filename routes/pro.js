var express = require('express')
var router = express.Router()
var fs = require('fs')
var mongoose = require('../models/bdd')
var agencyModel = require('../models/agencyModel.js')
var agentModel = require('../models/agentModel.js')
var adModel = require('../models/adModel.js')
var cloudinary = require('cloudinary').v2;
const path = require('path')

require('dotenv').config()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const saltRounds = 12;


cloudinary.config({ 
  cloud_name: 'dp4mkibm2', 
  api_key: '692324412372859', 
  api_secret: 'IIAMf3ZmBfXycAVxnqGFpctM-YE' 
});

const agencyID = "5e6222aa670cd85f2fb6ba51" // temporaire le temps de gérer les agences 

let status
let response
let login_duration = 30 //30 minutes

/* --------------------------------------------------TOKEN GENERATION & CHECK--------------------------------------------------------- */
const generateAgentAccessToken = (agentInfo, minutes) => { 
  return jwt.sign(agentInfo, process.env.JWT_AGENT_ACCESS_KEY, {
    expiresIn: 60 * minutes // 60sec * 30min
  })
}


const authenticateAgent = (req, res, next) => {
  const authHeader = req.headers.authorization
  let accessToken = authHeader && authHeader.split(' ')[1]

  if (accessToken === null || !req.cookies.aRT) {  //if no token 
    status = 401,
    response = {
      message: 'Authentification error',
      details: "Erreur d'authentification"
    }
  } else {

    jwt.verify(accessToken, process.env.JWT_AGENT_ACCESS_KEY, async (err, agent) => {
      if (err) {  //if access token is not valid
        status = 403;
        response = {
          message: 'Bad token',
          details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
        }
      res.status(status).json(response)
      } else {

        const currentTime = Math.round((new Date()).getTime() / 1000);
        const tokenExpiresIn = agent.exp - currentTime

        if (tokenExpiresIn < 300) { // if token expires in less than 5minutes, try to update it
          const findAgent = await agentModel.findOne({ token:req.cookies.aRT })
          if (!findAgent) { // if refresh token is not valid
            status = 403
            response = {
              message: 'Bad token',
              details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
            }
          } else {
            const agentInfo = {
              lastname: findAgent.lastname,
              firstname: findAgent.firstname,
              email: findAgent.email,
              id: findAgent._id
            }
            accessToken = generateAgentAccessToken(agentInfo, login_duration)
          }
        }

        req.accessToken = accessToken
        req.agentInfo = agent
        next()
      }
    })
  }
}

/* --------------------------------------------------ACCESS / SIGN IN / SIGN UP--------------------------------------------------------- */
/* Check token to access app*/
router.get('/user-access', authenticateAgent, async function(req, res) {
  // if authenticateAgent don't block, then authenticate user
  status = 200
    response = {
      message: 'OK',
      data: {
        accessToken: req.accessToken,
        agentInfo: req.agentInfo
      }
    }
  res.status(status).json(response);
})

/* Logout to remove refresh token */
router.get('/logout', async function(req,res) {

  try {

    let deleteToken = await agentModel.updateOne(
      { token: req.cookies.aRT }, 
      { $unset: { token: null } }
    )

    if (!deleteToken) {
      status = 500;
      response = {
        message: 'Internal error',
        details: 'Le serveur a rencontré une erreur.'
      }
    } else {
      status = 200
      response = {
        message: 'OK',
        details: 'Successfully logged out'
      }
      res.clearCookie('aRT', {path:'/pro'})
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

/* PRO sign-in */
router.post('/sign-in', async function(req, res, next) {

  let refreshCookie

  try {

    if( ['null', ''].indexOf(req.body.email) > 0 || ['', 'null'].indexOf(req.body.password) > 0 ) {
      status = 401;
      response = {
        message: 'Form error',
        details: 'Veuillez remplir tous les champs'
      }
    } else {

      const findAgent = await agentModel.findOne({ email:req.body.email });
      if(!findAgent) {
        status = 401;
        response = {
          message: 'Authentification error',
          details: "Erreur d'authentification"
        }
      } else {
        const pwdMatch = await bcrypt.compare(req.body.password, findAgent.password);
        if (pwdMatch) {

          /* Update refresh token */
          const refreshToken = jwt.sign({}, process.env.JWT_AGENT_REFRESH_KEY)
          let updatePwd = await agentModel.updateOne(
            {_id: findAgent._id},
            {$set: {token: refreshToken}}
          )

          if(!updatePwd) { 
            status = 500;
            response = {
              message: 'Internal error',
              details: 'Le serveur a rencontré une erreur.'
            }
          } else {
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
            status = 200
            response = {
              message: 'OK',
              data: {
                accessToken: generateAgentAccessToken(agentInfo, login_duration),
                agentInfo
              }
            }
          }

        } else {
          status = 401;
          response = {
            message: 'Authentification error',
            details: "Erreur d'authentification"
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
  res.cookie('aRT', refreshCookie, {httpOnly: true, path:'/pro'})
  res.status(status).json(response);
});

/* PRO sign-up */
router.post('/sign-up', async function(req, res, next) {

  let refreshCookie

  try {

    if(['null', ''].indexOf(req.body.email) > 0 || ['', 'null'].indexOf(req.body.password) > 0 ) {
      status = 401;
      response = {
        message: 'Form error',
        details: 'Veuillez remplir tous les champs'
      }
    } else {

      const findAgent = await agentModel.findOne({
        email: req.body.email
      })

      if(findAgent){
        status = 401;
        response = {
          message: 'User already exists',
          details: 'Cet utilisateur existe déjà'
        }
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
        const adToAgency = await agencyModel.updateOne(
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
        status = 200;
        response = {
          message: 'OK',
          data: {
            accessToken: generateAgentAccessToken(agentInfo, login_duration),
            agentInfo
          }
        }
      }
    }

  } catch(e) {
    status = 500;
    response = {
      message: 'Internal error',
      details: 'Le serveur a rencontré une erreur.'
    }
  }

  res.cookie('aRT', refreshCookie, {httpOnly: true, path:'/pro'})
  res.status(status).json(response);
})

/* --------------------------------------------------LIST ALL ADS FOR AN AGENT--------------------------------------------------------- */
/* GET PRO ads */
router.get('/ads', authenticateAgent, async function(req, res) {

  try {
    let adsFromAgent = await agentModel.findOne({ _id:req.agentInfo.id })
      .populate('ads')
      .exec()
    ;
    if(!adsFromAgent) { 
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
          accessToken: req.accessToken,
          ads: adsFromAgent.ads
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
});

/* --------------------------------------------------GET, POST UPDATE AND DELETE AN AD--------------------------------------------------------- */

/* GET Ad details */
router.get('/ad/:id_ad', authenticateAgent, async function(req, res) {

  try {

    let ad = await adModel.findById(req.params.id_ad); // Trouver les détails de l'annonce
    status = 200;
    response = {
      message: 'OK',
      data: {
        accessToken: req.accessToken,
        ad
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


/* POST ad */
router.post('/ad', authenticateAgent, async function(req, res) {

  try {

    let adID = req.body.adID

    let photos = req.body.photos
    let photosUrl = []

    
    for(i=0; i<photos.length ; i++) {
      var resultCloudinary = await cloudinary.uploader.upload(`./temp/${adID}-${photos[i]}`, {use_filename: true, unique_filename: false});
      photosUrl.push(resultCloudinary.url)
    }

    for(i=0; i < photos.length ; i++) {
      fs.unlinkSync(`./temp/${adID}-${photos[i]}`);
    }

    let files = req.body.files
    let filesUrl = []
    
    for(i=0; i < files.length ; i++) {
      var resultCloudinary = await cloudinary.uploader.upload(`./temp/${adID}-${files[i]}`, {use_filename: true, unique_filename: false});
      filesUrl.push(resultCloudinary.url)
    }

    for(i=0; i< files.length ; i++) {
      fs.unlinkSync(`./temp/${adID}-${files[i]}`);
    }

    let timeslots = req.body.timeSlots
    timeslots.forEach(e => e.agent = req.agentInfo.id)

    let tempAd = new adModel ({
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
      photos: photosUrl,
      video: req.body.video,
      area: req.body.area,
      rooms: req.body.rooms,
      bedrooms: req.body.bedrooms,
      advantages : req.body.advantages,
      options: req.body.options,
      dpe: req.body.dpe,
      ges: req.body.ges,
      files: filesUrl,
      timeSlots: timeslots
    });

    let newAd = await tempAd.save();
  
    let adToAgent = await agentModel.updateOne(
      { _id: mongoose.Types.ObjectId(req.agentInfo.id) }, 
      { $push: { ads : newAd._id } }
    )

    if(!adToAgent) { 
      status = 500;
      response = {
        message: 'Internal error',
        details: 'Le serveur a rencontré une erreur.'
      };
    } else {
      status = 200;
      response = {
        message: 'OK',
        data: {
          accessToken: req.accessToken,
          newAd
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

/* UPDATE ad  */
router.put('/ad/:id_ad', async function(req, res, next) {

  try {

      let adID = req.body.adID

      let photos = req.body.photos
      let photosUrl = []
  
      for(i=0; i<photos.length ; i++) {
        var resultCloudinary = await cloudinary.uploader.upload(`./temp/${adID}-${photos[i]}`, {use_filename: true, unique_filename: false});
        photosUrl.push(resultCloudinary.url)
      }
  
      for(i=0; i < photos.length ; i++) {
        fs.unlinkSync(`./temp/${adID}-${photos[i]}`);
      }

      photosUrl = [...photosUrl, ...req.body.photosDB]
  
      let files = req.body.files
      let filesUrl = []
      
      for(i=0; i < files.length ; i++) {
        var resultCloudinary = await cloudinary.uploader.upload(`./temp/${adID}-${files[i]}`, {use_filename: true, unique_filename: false});
        filesUrl.push(resultCloudinary.url)
      }
  
      for(i=0; i< files.length ; i++) {
        fs.unlinkSync(`./temp/${adID}-${files[i]}`);
      }

      filesUrl = [...filesUrl, ...req.body.filesDB]

    let updateAd = await adModel.updateOne(
      { _id: req.params.id_ad }, 
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
        photos: photosUrl,
        video: req.body.video,
        area: req.body.area,
        rooms: req.body.rooms,
        bedrooms: req.body.bedrooms,
        advantages : req.body.advantages,
        options: req.body.options,
        dpe: req.body.dpe,
        ges: req.body.ges,
        files: filesUrl,
        timeSlots: req.body.timeSlots
      }
    );

    if(!updateAd) { 
      status = 500;
      response = {
        message: 'Internal error',
        details: 'Le serveur a rencontré une erreur.'
      };
    } else {
      status = 200;
      response = {
        message: 'OK',
        data: {
          accessToken: req.accessToken, 
          updateAd
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

/* DELETE ad */
router.delete('/ad/:id_ad', authenticateAgent, async function(req, res, next) {

  try {

    let findAd = await adModel.findById(req.params.id_ad) // get ad

    // format photos link to extract only the public ID of photos
    let formatPhotos = findAd.photos.map((e) => { 
      return e.split('upload/')[1].split('/')[1].split('.')[0]
    })

    // delete photos from cloudinary
    for(i=0; i<formatPhotos.length; i ++) {  
      const deletePhotos = await cloudinary.uploader.destroy(formatPhotos[i])
    }

    // format files link to extract only the public ID of files
    let formatFiles = findAd.files.map((e) => { 
      return e.split('upload/')[1].split('/')[1].split('.')[0]
    })

    // delete files from cloudinary
    for(i=0; i<formatFiles.length; i ++) {  
      const deleteFiles = await cloudinary.uploader.destroy(formatFiles[i])
    }

    //delete ad from DB
    let deleteAd = await adModel.deleteOne({ _id: req.params.id_ad });

    // delete ad id from agent
    const findAgent = await agentModel.findById(req.agentInfo.id);
    let adsFromAgent = findAgent.ads; 

    adsFromAgent = adsFromAgent.filter(e => e._id != req.params.id_ad);

    let deleteAdFromAgent = await agentModel.updateOne(
        { _id: findAgent._id }, 
        { $set: { ads: adsFromAgent } }
    )

    status = 200;
    response = {
      message: 'OK',
      data: {
        accessToken: req.accessToken,
        deleteAdFromAgent
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


/* UPDATE ad onlineStatus */
router.put('/ad/:id_ad/online', async function(req, res, next) {

  try {
    let updateAd = await adModel.updateOne(
      { _id: req.params.id_ad }, 
      { 
        onlineStatus: req.body.onlineStatus,
        onlineDate: new Date
      }
    );
    
    status = 200;
    response = {
      message: 'OK',
      data: updateAd
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

/* --------------------------------------------------CALENDAR: CREATE, UPDATE AND DELETE TIMESLOTS--------------------------------------------------------- */

/* POST timeslot */
router.post('/ad/:id_ad/timeslots', authenticateAgent, async function(req, res) {

  try {

    let tableTimeslots = JSON.parse(req.body.timeslot);

    let frontTimeslots = tableTimeslots.map(obj => {
      return { 
        booked: false,
        start: obj.start,
        end: obj.end,
        private: obj.private,
        agent: req.agentInfo.id
      }
    });

    let timeslotsFromBdd = await adModel.findById(req.params.id_ad);
    timeslotsFromBdd = timeslotsFromBdd.timeSlots; 

    let allTimeslots = timeslotsFromBdd.concat(frontTimeslots);

    let newTimeslot = await adModel.updateOne(
        { _id: req.params.id_ad }, 
        { $set: { timeSlots: allTimeslots }, visitStatus: true }
    );

    if(!newTimeslot) { 
      status = 500;
      response = {
        message: 'Internal error',
        details: 'Le serveur a rencontré une erreur.'
      };
    } else {
      status = 200;
      response = {
        message: 'OK',
        data: {
          accessToken: req.accessToken,
          allTimeslots
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
});

/* PUT timeslot */
router.put('/ad/:id_ad/timeslot/:id_timeslot', authenticateAgent, async function(req, res) {

  try {

    let tableTimeslots = JSON.parse(req.body.timeslot);

    let frontTimeslots = tableTimeslots.map(obj => {
      return { 
        booked: false,
        start: obj.start,
        end: obj.end,
        private: obj.private,
        agent: req.agentInfo.id
      }
    });

    let timeslotsFromBdd = await adModel.findById(req.params.id_ad);
    timeslotsFromBdd = timeslotsFromBdd.timeSlots; 

    timeslotsFromBdd = timeslotsFromBdd.filter(e => e._id != req.params.id_timeslot);

    let allTimeslots = timeslotsFromBdd.concat(frontTimeslots);

    let newTimeslot = await adModel.updateOne(
        { _id: req.params.id_ad }, 
        { $set: { timeSlots: allTimeslots }, visitStatus: true }
    );

    if(!newTimeslot) { 
      status = 500;
      response = {
        message: 'Internal error',
        details: 'Le serveur a rencontré une erreur.'
      };
    } else {
      status = 200;
      response = {
        message: 'OK',
        data: {
          accessToken: req.accessToken,
          allTimeslots
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
});

/* DELETE timeslot */
router.delete('/ad/:id_ad/timeslot/:id_timeslot', authenticateAgent, async function(req, res) {

  try {
          
    let timeslotsFromBdd = await adModel.findById(req.params.id_ad);
    timeslotsFromBdd = timeslotsFromBdd.timeSlots; 

    timeslotsFromBdd = timeslotsFromBdd.filter(e => e._id != req.params.id_timeslot);

    let deleteTimeslot = await adModel.updateOne(
        { _id: req.params.id_ad }, 
        { $set: { timeSlots: timeslotsFromBdd } }
    )

    if(!deleteTimeslot) { 
      status = 500;
      response = {
        message: 'Internal error',
        details: 'Le serveur a rencontré une erreur.'
      }
    } else {
      status = 200;
      response = {
        message: 'OK',
        data: {
          accessToken: req.accessToken,
          deleteTimeslot
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

/* -----------------------------------------OFFER: ACCEPT, DECLINE & CANCEL--------------------------------------------------------- */
/* PUT accept offer */
router.put('/ad/:id_ad/offer/:id_offer/accept', async function(req, res, next) {

  try {

    let acceptedOffer = await adModel.updateOne(
      { _id: req.params.id_ad, "offers._id": req.params.id_offer  }, 
      { "offers.$.status": 'accepted' }
    )

    let declinedOffers = await adModel.updateMany(
      { _id: req.params.id_ad,"offers._id": req.params.id_offer },
      { $set: { "offers.$[elem].status" : 'declined' } },
      { arrayFilters: [ { "elem.status": 'pending' } ] }
    )

    status = 200;
    response = {
      message: 'OK',
      data: {
        accessToken: req.accessToken,
        acceptedOffer
      }
    }

  } catch(e) {
    status = 500;
    response = {
      message: 'Internal error',
      details: 'Le serveur a rencontré une erreur.'
    }
  }

  res.status(status).json(response);
});

/* PUT decline offer */
router.put('/ad/:id_ad/offer/:id_offer/decline', authenticateAgent, async function(req, res) {

  try {

    let declinedOffer = await adModel.updateOne(
      { _id: req.params.id_ad, "offers._id": req.params.id_offer  }, 
      { "offers.$.status": 'declined' }
    );

    status = 200;
    response = {
      message: 'OK',
      data: {
        accessToken: req.accessToken,
        declinedOffer
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

/* CANCEL accepted offer */
router.put('/ad/:id_ad/offer/:id_offer/cancel', authenticateAgent, async function(req, res) {

  try {

    let cancelAcceptedOffer = await adModel.updateOne(
      { _id: req.params.id_ad, "offers._id": req.params.id_offer  }, 
      { "offers.$.status": 'declined' }
    );

    let cancelDeclinedOffer = await adModel.updateMany(
      { _id: req.params.id_ad, "offers._id": req.params.id_offer },
      { $set: { "offers.$[elem].status" : 'pending' } },
      { arrayFilters: [ { "elem.status": 'declined' } ] }
    )

    status = 200;
    response = {
      message: 'OK',
      data: {
        accessToken: req.accessToken,
        cancelAcceptedOffer
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

// POST Upload images from form 
router.post('/upload', async function(req, res, next) {
  
  var resultCopy = await req.files.file.mv(`./temp/${req.body.token}-${req.files.file.name}`);
  
  if(!resultCopy) {
    res.json({result: true, name: req.files.file.name, message: `${req.files.file.name} uploaded!`} );       
  } else {
    res.json({result: false, name: req.files.file.name, message: `couldn't upload ${req.files.file.name}`} );
  } 
});

// DELETE images from temp folder 

router.delete('/upload/:name', async function(req, res, next) {

  fs.unlinkSync(`./temp/${req.params.name}`)
  res.json("deleted")
});

// GET images from temp folder

router.get('/tempfiles', async function(req, res, next) { 

  res.sendFile(path.join(__dirname, `../temp/${req.query.name}`));
});

// DELETE images from cloudinary

router.delete('/image/:name', async function(req, res, next) {

  const requestCloudinary = await cloudinary.uploader.destroy(req.params.name)  

  res.json(requestCloudinary)
});


/* PUT answer question */
router.put('/ad/:id_ad/question/:id_question/answer', authenticateAgent, async function(req, res) {

  console.log('response : ' + req.body.response)

  try {

      let answeredQuestion = await adModel.updateOne(
        { _id: req.params.id_ad, "questions._id": req.params.id_question  }, 
        { "questions.$.status": 'answered', "questions.$.response": req.body.response }
      );

      status = 200;
      response = {
        message: 'OK',
        data: answeredQuestion
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

/* PUT decline question */
router.put('/ad/:id_ad/question/:id_question/decline', authenticateAgent, async function(req, res) {

  try {

      let declinedQuestion = await adModel.updateOne(
        { _id: req.params.id_ad, "questions._id": req.params.id_question  }, 
        { "questions.$.status": 'declined', "questions.$.response": req.body.declineReason  }
      );

      status = 200;
      response = {
        message: 'OK',
        data: declinedQuestion
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


module.exports = router;