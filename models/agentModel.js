var mongoose = require('./bdd');

var agentSchema = mongoose.Schema({
    token: String,
    admin: Boolean,
    lastname: String,
    firstname: String,
    email: String,
    password: String,
    ads: [{type: mongoose.Schema.Types.ObjectId, ref: 'ads'}]
});

var agentModel = mongoose.model('agents', agentSchema);

module.exports = agentModel;