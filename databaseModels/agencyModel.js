var mongoose = require('./bdd');

var agencySchema = mongoose.Schema({
    name: String,
    logo: String,
    address: String,
    phone: String,
    employees: [agentSchema]
});

var agentSchema = mongoose.Schema({
    admin: Boolean,
    lastname: String,
    firstname: String,
    email: String,
    password: String
});

var agencyModel = mongoose.model('ad', agencySchema);

module.exports = agencyModel;
