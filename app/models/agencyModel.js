var mongoose = require('./bdd');

var agencySchema = mongoose.Schema({
    agents: [{type: mongoose.Schema.Types.ObjectId, ref: 'agents'}],
    name: String,
    logo: String,
    address: String,
    phone: String,
});

var agencyModel = mongoose.model('agencies', agencySchema);

module.exports = agencyModel;
