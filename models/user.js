const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, unique: true},
    name: String,
    country: String,
    city: String,
    email: String,
    time: String,
    password: String,
    watchLater: Array,
    ratedMovies: [{
        id: String,
        rating: String
    }],
    favorite: Array,
    watched: Array,
    role: String
}, {timestamps : true});

const User = mongoose.model('User', userSchema);

module.exports = User;