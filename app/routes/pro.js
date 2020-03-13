var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('../models/bdd');
var agencyModel = require('../models/agencyModel.js')
var agentModel = require('../models/agentModel.js')
var adModel = require('../models/adModel.js')
var cloudinary = require('cloudinary').v2;
const path = require('path');


var uid2 = require("uid2");
const jwt = require('jsonwebtoken')
const JWTPrivateKey = "n4opQ61HEDNPkLw9xBOdGTw92CTKgcrx" 
const bcrypt = require('bcryptjs');
const saltRounds = 12;


cloudinary.config({ 
  cloud_name: 'dp4mkibm2', 
  api_key: '692324412372859', 
  api_secret: 'IIAMf3ZmBfXycAVxnqGFpctM-YE' 
});

const generateToken = () => { // it is possible to add data (payload) by adding an argument to the function -- see doc
  u = {} //payload data
  return token = jwt.sign(u, JWTPrivateKey, {
    expiresIn: 60 // 24h 60 * 60 * 24
  })
}

const agencyID = "5e6222aa670cd85f2fb6ba51" // temporaire le temps de gérer les agences 

// var request = require('sync-request');

let status;
let response;


/* Check token to access app*/
router.get('/user-access', async function(req, res, next) {

  try {

    let findAgent = await agentModel.findOne({ token:req.headers.token });
  
    if(!findAgent) { 
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
          ads: findAgent.ads,
          token: findAgent.token
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

/* PRO sign-in */
router.post('/sign-in', async function(req, res, next) {

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
          status = 200;
          response = {
            message: 'OK',
            data: {
              ads: findAgent.ads,
              token: findAgent.token
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

  res.status(status).json(response);
});

/* PRO sign-up */
router.post('/sign-up', async function(req, res, next) {

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

      if(!findAgent){
        status = 401;
        response = {
          message: 'User already exists',
          details: 'Cet utilisateur existe déjà'
        }
      } else {
        var hash = await bcrypt.hash(req.body.password, saltRounds)
        /* Création agent */
        const newAgent = new agentModel({
          // admin: req.body.admin,
          // lastname: req.body.lastname,
          // firstname: req.body.firstname,
          email: req.body.email,
          password: hash,
          token: generateToken()
        })

        saveAgent = await newAgent.save()

        /* Rattachement à l'agence */
        const adToAgency = await agencyModel.updateOne(
          { _id: agencyID }, 
          { $push: { agents : saveAgent._id } }
        )
        status = 200;
        response = {
          message: 'OK',
          data: {
            ads: saveAgent.ads,
            token: saveAgent.token
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


/* POST ad */
router.post('/ad', async function(req, res, next) {

  try {

    let findAgent = await agentModel.findOne({ token: req.headers.token });

    if(!findAgent) { 
      status = 401;
      response = {
        message: 'Bad token',
        details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
      };
    } else {
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
      timeslots.forEach(e => e.agent = findAgent._id)
  
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
        { _id: findAgent._id }, 
        { $push: { ads : newAd._id } }
      )  
  
      status = 200;
      response = {
        message: 'OK',
        data: newAd
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

    let findAgent = await agentModel.findOne({ token: req.headers.token });

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

/* DELETE ad */
router.delete('/ad/:id_ad', async function(req, res, next) {

  try {

    let findAgent = await agentModel.findOne({ token:req.headers.token });

    if(!findAgent) { 
      status = 401;
      response = {
        message: 'Bad token',
        details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
      };
    } else {

      let findAd = await adModel.findById(req.params.id_ad) // get ad

      // format photos link to extract only the public ID of photos
      let formatPhotos = findAd.photos.map((e) => { 
        return e.split('upload/')[1].split('/')[1].split('.')[0]
      })

      // delete photos from cloudinary
      for(i=0; i<formatPhotos.length; i ++) {  
        const deletePhotos = await cloudinary.uploader.destroy(formatPhotos[i])
        console.log(deletePhotos)
      }

      // format files link to extract only the public ID of files
      let formatFiles = findAd.files.map((e) => { 
        return e.split('upload/')[1].split('/')[1].split('.')[0]
      })

      // delete files from cloudinary
      for(i=0; i<formatFiles.length; i ++) {  
        const deleteFiles = await cloudinary.uploader.destroy(formatFiles[i])
        console.log(deleteFiles)
      }

      //delete ad from DB
      let deleteAd = await adModel.deleteOne({ _id: req.params.id_ad });

      // delete ad id from agent
      let adsFromAgent = await agentModel.findById(req.params.id_ad);
      adsFromAgent = findAgent.ads; 

      adsFromAgent = adsFromAgent.filter(e => e._id != req.params.id_ad);

      let deleteAdFromAgent = await agentModel.updateOne(
          { _id: findAgent._id }, 
          { $set: { ads: adsFromAgent } }
      );

      status = 200;
      response = {
        message: 'OK',
        data: deleteAdFromAgent
      }
    };

  } catch(e) {
    console.log(e)
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

/* POST timeslot */
router.post('/ad/:id_ad/timeslots', async function(req, res, next) {

  try {

    let findAgent = await agentModel.findOne({ token:req.headers.token });

    let tableTimeslots = JSON.parse(req.body.timeslot);

    let frontTimeslots = tableTimeslots.map(obj => {
      return { 
        booked: false,
        start: obj.start,
        end: obj.end,
        private: obj.private,
        agent: findAgent._id
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
      status = 401;
      response = {
        message: 'Bad token',
        details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
      };
    } else {
      status = 200;
      response = {
        message: 'OK',
        data: allTimeslots
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
router.put('/ad/:id_ad/timeslot/:id_timeslot', async function(req, res, next) {

  try {

    let findAgent = await agentModel.findOne({ token:req.headers.token });

    if(!findAgent) { 
      status = 401;
      response = {
        message: 'Bad token',
        details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
      };
    } else {

      let tableTimeslots = JSON.parse(req.body.timeslot);

      let frontTimeslots = tableTimeslots.map(obj => {
        return { 
          booked: false,
          start: obj.start,
          end: obj.end,
          private: obj.private,
          agent: findAgent._id
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

      status = 200;
      response = {
        message: 'OK',
        data: allTimeslots
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
router.delete('/ad/:id_ad/timeslot/:id_timeslot', async function(req, res, next) {

  try {

    let findAgent = await agentModel.findOne({ token:req.headers.token });

    if(!findAgent) { 
      status = 401;
      response = {
        message: 'Bad token',
        details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
      };
    } else {
          
      let timeslotsFromBdd = await adModel.findById(req.params.id_ad);
      timeslotsFromBdd = timeslotsFromBdd.timeSlots; 

      timeslotsFromBdd = timeslotsFromBdd.filter(e => e._id != req.params.id_timeslot);

      let deleteTimeslot = await adModel.updateOne(
          { _id: req.params.id_ad }, 
          { $set: { timeSlots: timeslotsFromBdd } }
      );

      status = 200;
      response = {
        message: 'OK',
        data: deleteTimeslot
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

/* GET timeslots (pour l'instant inutile) */
router.get('/ads/timeslots', async function(req, res, next) {

  try {

    let findAgent = await agentModel.findOne({ token:req.headers.token });
    let timeslotsFromAgent = await adModel.aggregate([
      { $unwind: "$timeSlots" },
      { $match: { 'timeSlots.agent' : findAgent._id } }
    ]).exec();

    if(!timeslotsFromAgent) { 
      status = 401;
      response = {
        message: 'Bad token',
        details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
      };
    } else {
      status = 200;
      response = {
        message: 'OK',
        data: timeslotsFromAgent
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


/* GET PRO ads */
router.get('/ads', async function(req, res, next) {

  try {
    let adsFromAgent = await agentModel.findOne({ token:req.headers.token }) // authenticate user and return his ads
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
          ads: adsFromAgent.ads,
          token: adsFromAgent.token
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

// GET Ad offers
router.get('/ad/:id_ad/offers', async function(req, res, next) {

  try {
    let findAgent = await agentModel.find({token:req.headers.token}); // authenticate user

    if(findAgent.length === 0) { 
      status = 401;
      response = {
        message: 'Bad token',
        details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
      };
    } else {
      let offersFromAd = await adModel
        .findOne({_id : req.params.id_ad})
        .populate('offers.offer')
        .exec()
      ; // search ad and return its offers

      status = 200;
      response = {
        message: 'OK',
        data: offersFromAd.offers
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

/* PUT accept offer */
router.put('/ad/:id_ad/offer/:id_offer/accept', async function(req, res, next) {

  try {
    let findAgent = await agentModel.findOne({ token:req.headers.token });

    if(!findAgent) { 
      status = 401;
      response = {
        message: 'Bad token',
        details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
      };
    } else {

      let acceptedOffer = await adModel.updateOne(
        { _id: req.params.id_ad, "offers._id": req.params.id_offer  }, 
        { "offers.$.status": 'accepted' }
      );

      let declinedOffers = await adModel.updateMany(
        { _id: req.params.id_ad,"offers._id": req.params.id_offer },
        { $set: { "offers.$[elem].status" : 'declined' } },
        { arrayFilters: [ { "elem.status": 'pending' } ] }
      )

      status = 200;
      response = {
        message: 'OK',
        data: acceptedOffer
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

/* PUT decline offer */
router.put('/ad/:id_ad/offer/:id_offer/decline', async function(req, res, next) {

  try {
    let findAgent = await agentModel.findOne({ token:req.headers.token });

    if(!findAgent) { 
      status = 401;
      response = {
        message: 'Bad token',
        details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
      };
    } else {

      let declinedOffer = await adModel.updateOne(
        { _id: req.params.id_ad, "offers._id": req.params.id_offer  }, 
        { "offers.$.status": 'declined' }
      );

      status = 200;
      response = {
        message: 'OK',
        data: declinedOffer
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

/* CANCEL accepted offer */
router.put('/ad/:id_ad/offer/:id_offer/cancel', async function(req, res, next) {

  // try {
    let findAgent = await agentModel.findOne({ token:req.headers.token });

    if(!findAgent) { 
      status = 401;
      response = {
        message: 'Bad token',
        details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
      };
    } else {

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
        data: cancelAcceptedOffer
      }
    };

  // } catch(e) {
  //   status = 500;
  //   response = {
  //     message: 'Internal error',
  //     details: 'Le serveur a rencontré une erreur.'
  //   };
  // }

  res.status(status).json(response);

});

// GET Ad details
router.get('/ad/:id_ad', async function(req, res, next) {

  try {
    let findAgent = await agentModel.find({token:req.headers.token}); // authenticate user

    if(findAgent.length === 0) { 
      status = 401;
      response = {
        message: 'Bad token',
        details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
      };
    } else {
      let adForDetails = await adModel.findById(req.params.id_ad); // Trouver les détails de l'annonce
      status = 200;
      response = {
        message: 'OK',
        data: adForDetails
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


module.exports = router;