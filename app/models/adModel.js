var mongoose = require('./bdd');

var adSchema = mongoose.Schema({
    creationDate: Date.now,
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
    question: [questionSchema],
    timeSlot: [timeSlotSchema],
    offer: [offerSchema]
});

var timeSlotSchema = mongoose.Schema({
    booked: Boolean,
    agent: [
        {type: Schema.Types.ObjectId, ref: 'agent'}
    ],
    customer: [
        {type: Schema.Types.ObjectId, ref: 'customer'}
    ],
    start: Date,
    end: Date
});

var questionSchema = mongoose.Schema({
    status: String,
    question: String,
    response: String
});

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

var adModel = mongoose.model('ad', adSchema);

module.exports = adModel;
