var mongoose = require('./bdd');

var agentSchema = mongoose.Schema({
    token: String,
    ads: [{type: mongoose.Schema.Types.ObjectId, ref: 'ads'}],
    admin: Boolean,
    lastname: String,
    firstname: String,
    email: String,
    password: String
});

var agentModel = mongoose.model('agents', agentSchema);

module.exports = agentModel;