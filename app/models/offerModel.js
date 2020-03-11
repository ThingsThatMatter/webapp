var mongoose = require('./bdd');

var offerSchema = mongoose.Schema({
    creationDate: Date,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    singleBuyer: Boolean,
    lastName1: String,
    firstName1: String,
    lastName2: String,
    firstName2: String,
    address: String,
    postCode: String,
    city: String,
    amount: Number,
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
    comments: String,
    status: String /* pending, acceped, rejected, expired*/ 
});

var offerModel = mongoose.model('offers', offerSchema);

module.exports = offerModel;
