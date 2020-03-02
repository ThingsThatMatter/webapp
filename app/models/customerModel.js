var mongoose = require('./bdd');

var customerSchema = mongoose.Schema({
    creationDate: Date.now,
    lastname: String,
    firstname: String,
    email: String,
    password: String,
    ads: [
        {type: Schema.Types.ObjectId, ref: 'ad'}
    ]
});

var customerModel = mongoose.model('customer', customerSchema);

module.exports = customerModel;
