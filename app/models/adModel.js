var mongoose = require('./bdd');

var timeSlotSchema = mongoose.Schema({
    agent: {type: mongoose.Schema.Types.ObjectId, ref: 'agents'},
    customer: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'customers'}
    ],
    start: Date,
    end: Date,
    group: Boolean,
    maxVisitors: Number,
    bookable: Boolean
});

var questionSchema = mongoose.Schema({
    status: String,
    question: String,
    response: String
});

var adSchema = mongoose.Schema({
    agents: [{type: mongoose.Schema.Types.ObjectId, ref: 'agents'}],
    creationDate: Date,
    onlineDate: Date,
    color: String,
    draftStatus: Boolean,
    onlineStatus: Boolean,
    visitStatus: Boolean,
    soldStatus: Boolean,
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



var adModel = mongoose.model('ads', adSchema);

module.exports = adModel;
