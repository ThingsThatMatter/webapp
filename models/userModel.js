var mongoose = require('./bdd');

var userSchema = mongoose.Schema({
    token: String,
    creationDate: Date,
    lastname: String,
    firstname: String,
    email: String,
    password: String,
    ads: [{type: mongoose.Schema.Types.ObjectId, ref: 'ads'}]
});

var userModel = mongoose.model('users', userSchema);

module.exports = userModel;
