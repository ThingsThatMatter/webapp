var mongoose = require('./bdd');

var whishlistSchema = mongoose.Schema({
    title: String,
    description: String,
    content: String,
    urlToImage: String,
    lang: String
});

var userSchema = mongoose.Schema({
    firstname: String,
    email: String,
    password: String,
    token: String,
    lang: String,
    whishlist: [whishlistSchema]
});

var userModel = mongoose.model('users', userSchema);

module.exports = userModel;
