const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    movie_id: String,
    level: Number,
    username: String,
    comment_body: String,
    replies: Array,
}, {timestamps : true});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;