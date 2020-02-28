var mongoose = require('./bdd');

var customerSchema = mongoose.Schema({
    creationDate: Date.now,
    lastname: String,
    firstname: String,
    email: String,
    password: String,
    ads: [adSchema],
});

var adSchema = mongoose.Schema({
    ad: [
        {type: Schema.Types.ObjectId, ref: 'ad'}
    ],
    offer: [
        {type: Schema.Types.ObjectId, ref: 'offer'}
    ],
    visit: [visitSchema]
});

var visitSchema = mongoose.Schema({
    start: Date,
    end: Date
});

var customerModel = mongoose.model('ad', customerSchema);

module.exports = customerModel;
