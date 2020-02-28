var mongoose = require('./bdd');

var offerSchema = mongoose.Schema({
    creationDate: Date.now,
    customer: [
        {type: Schema.Types.ObjectId, ref: 'customer'}
    ],
    singleBuyer: Boolean,
    lastname1: String,
    firstname1: String,
    lastname2: String,
    firstname2: String,
    loan: Boolean,
    loanAmount: Number,
    contributionAmount: Number,
    monthlyPay: Number,
    notary: Boolean,
    notaryName: String,
    notaryAddress: String,
    notaryEmail: String,
    validityPeriod: Number,
    location: String,
    message: String
});

var offerModel = mongoose.model('ad', offerSchema);

module.exports = offerModel;
