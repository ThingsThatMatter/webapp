const mongoose = require('./bdd')

const timeSlotSchema = mongoose.Schema({
    booked: Boolean,
    private: Boolean,
    agent: {type: mongoose.Schema.Types.ObjectId, ref: 'agents'},
    user: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    start: Date,
    end: Date
})

const questionSchema = mongoose.Schema({
    creationDate: Date,
    status: String,
    question: String,
    response: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'}
})

const offerSchema = mongoose.Schema({
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
})

const fileSchema = mongoose.Schema({
    externalId: String,
    name: String,
    extension: String,
    url: String
})


const adSchema = mongoose.Schema({
    creationDate: Date,
    onlineDate: Date,
    color: String,
    onlineStatus: Boolean,
    offerStatus: Boolean,
    visitStatus: Boolean,
    price: Number,
    fees: Number,
    feesPayer: String,
    type: String,
    title: String,
    description: String,
    typeAddress: Boolean,
    address: String,
    postcode: Number,
    city: String,
    photos: [fileSchema],
    video: String,
    area: Number,
    rooms: Number,
    bedrooms: Number,
    advantages: [String],
    options: [String],
    dpe: String,
    ges: String,
    files: [fileSchema],
    questions: [questionSchema],
    timeSlots: [timeSlotSchema],
    offers: [offerSchema]
})

const adModel = mongoose.model('ads', adSchema)

module.exports = adModel
