var mongoose = require('./bdd');

var customerSchema = mongoose.Schema({
    creationDate: Date.now,
    lastname: String,
    firstname: String,
    email: String,
    password: String,
    token: String,
    ads: [adSchema],
});

var adSchema = mongoose.Schema({
    ad: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'ads'}
    ],
    offer: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'offers'}
    ],
    visit: visitSchema
});

var visitSchema = mongoose.Schema({
    start: Date,
    end: Date
});

var customerModel = mongoose.model('customers', customerSchema);

module.exports = customerModel;
