var mongoose = require('mongoose');

var options = { connectTimeoutMS: 5000, useNewUrlParser: true, useUnifiedTopology : true}

mongoose.connect('mongodb+srv://tristan:capsule@capsule-5esii.mongodb.net/morningnews?retryWrites=true&w=majority',
   options,
   function(err) {
    if (err) {
      console.log(`Erreur de connexion à la BDD ${err}`);
    } else {
      console.info('*** Vous êtes connecté à la BDD ***');
    }
   }
);

module.exports = mongoose;