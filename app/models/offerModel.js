var mongoose = require('./bdd');

var offerSchema = mongoose.Schema({
    creationDate: Date,
    customer: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
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
    message: String,
    status: String, /* pending, acceped, rejected, expired*/ 
    feesPayer: String /* buyer, seller */
});

var offerModel = mongoose.model('offers', offerSchema);

module.exports = offerModel;
