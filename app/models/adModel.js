var mongoose = require('./bdd');

var timeSlotSchema = mongoose.Schema({
    booked: Boolean,
    private: Boolean,
    agent: {type: mongoose.Schema.Types.ObjectId, ref: 'agents'},
    user: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    start: Date,
    end: Date
});

var questionSchema = mongoose.Schema({
    status: String,
    question: String,
    response: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'}
});

var offerSchema = mongoose.Schema({
    creationDate: Date,
    status: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    singleBuyer: Boolean,
    lastname1: String,
    firstname1: String,
    lastname2: String,
    firstname2: String,
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
    message: String
});

var adSchema = mongoose.Schema({
    creationDate: Date,
    onlineDate: Date,
    color: String,
    onlineStatus: Boolean,
    offerStatus: Boolean,
    visitStatus: Boolean,
    price: Number,
    fees: Number,
    type: String,
    title: String,
    description: String,
    typeAddress: String,
    address: String,
    postcode: Number,
    city: String,
    photos: [String],
    video: String,
    area: Number,
    rooms: Number,
    bedrooms: Number,
    elevator: Boolean,
    terrace: Boolean,
    balcony: Boolean,
    options: [String],
    dpe: String,
    ges: String,
    files: [String],
    questions: [questionSchema],
    timeSlots: [timeSlotSchema],
    offers: [offerSchema]
});

var adModel = mongoose.model('ads', adSchema);

module.exports = adModel;
