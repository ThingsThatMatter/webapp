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
    timeSlot: [timeSlotSchema],
    question: [questionSchema]
});

var timeSlotSchema = mongoose.Schema({
    agent: [
        {type: Schema.Types.ObjectId, ref: 'agent'}
    ],
    customer: [
        {type: Schema.Types.ObjectId, ref: 'customer'}
    ],
    start: Date,
    end: Date,
});

var questionSchema = mongoose.Schema({
    status: String,
    question: String,
    response: String
});

var adModel = mongoose.model('ad', adSchema);

module.exports = adModel;
