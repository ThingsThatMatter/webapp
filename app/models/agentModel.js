var mongoose = require('./bdd');

var agentSchema = mongoose.Schema({
    ads: [{type: mongoose.Schema.Types.ObjectId, ref: 'ads'}],
    admin: Boolean,
    lastname: String,
    firstname: String,
    email: String,
    password: String,
    token: String
});

var agentModel = mongoose.model('agents', agentSchema);

module.exports = agentModel;