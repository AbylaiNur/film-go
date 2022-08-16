const axios = require("axios");
const User = require('../models/user')
const Movie = require('../models/movie');
const Comment = require('../models/comment');
const find = (datas, key, value) => {
   for (let i = 0; i < datas.length; i++) {
       if (datas[i][key] === value) return datas[i];
   }
   return -1;
}


const title_details = async (req, res) => {
    const id = req.params.id;
    const videoTrailer = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=9db36715f42a504baccc657a0d88c924&language=en-US`;

    const movie = await Movie.findOne({id : id});
    const comments = await Comment.find({"movie_id":id}).sort({"createdAt":1});
    const trailerData = await axios(videoTrailer);
    const trailers = trailerData.data.results;
    res.render('title', { movie: movie, movieTrailer : find(trailers, "type", "Trailer"), user : req.session.user, comments: comments });
}

const title_add_watch_later = async (req, res) => {
    const id = req.params.id;
    let found = false;
    for (let i = 0; i < req.session.user.watchLater.length; i++) {
        if (req.session.user.watchLater[i] === id) {
            found = true;
        }
    }
    if (!found) {
        await User.findByIdAndUpdate(req.session.user._id, {$push: {watchLater: id}});
        req.session.user = await User.findById(req.session.user._id);
    }
    res.redirect(`/title/${id}`);
}

const title_add_favorite = async (req, res) => {
    const id = req.params.id;
    let found = false;
    for (let i = 0; i < req.session.user.favorite.length; i++) {
        if (req.session.user.favorite[i] === id) {
            found = true;
        }
    }
    if (!found) {
        await User.findByIdAndUpdate(req.session.user._id, {$push: {favorite: id}});
        req.session.user = await User.findById(req.session.user._id);
    }

    res.redirect(`/title/${id}`);
}

const title_add_watched = async (req, res) => {
    const id = req.params.id;
    let found = false;
    for (let i = 0; i < req.session.user.watched.length; i++) {
        if (req.session.user.watched[i] === id) {
            found = true;
        }
    }
    if (!found) {
        await User.findByIdAndUpdate(req.session.user._id, {$push: {watched: id}});
        req.session.user = await User.findById(req.session.user._id);
    }
    res.redirect(`/title/${id}`);
}

const rate = async (req, res) => { // I hate this part so much
    const id = req.params.id;
    const rating = Math.max(Math.min(req.params.rating, 10), 1);

    if (await User.findOne({_id: req.session.user._id, "ratedMovies.id" : id})) {
        const ratedMovies = req.session.user.ratedMovies;
        for (let i = 0; i < ratedMovies.length; i++) {
            if (ratedMovies[i].id === id) {
                const ratingBefore = ratedMovies[i].rating;
                await Movie.updateOne({id : id}, { $inc : {vote: -ratingBefore}});
                break;
            }
        }
        await User.updateOne({_id: req.session.user._id, "ratedMovies.id" : id},
            {"$set" : { "ratedMovies.$.rating" : rating }});
    } else {
        await User.updateOne({_id: req.session.user._id},
            {"$push" : { "ratedMovies" : {"id" : id, "rating": rating} }});
        await Movie.updateOne({id : id}, { $inc : {vote_count: 1}});
    }
    req.session.user = await User.findById(req.session.user._id);
    await Movie.updateOne({id : id}, {$inc : {vote: rating}});
    res.redirect(`/title/${id}`);
}

const title_add_comment = async (req,res) => {
    const id = req.params.id;
    const comment = new Comment ({
        movie_id:String(id),
        level: 0,
        username:String(req.session.user.username),
        comment_body:req.body.comment
    })

    comment.save();
    res.redirect(`/title/${id}`);
}
const title_reply_to_comment = async (req,res) => {
    const id = req.params.id;
    const id2 = req.params.id2;
    const comment = new Comment ({
        movie_id: String(id),
        level: 1,
        username:String(req.session.user.username),
        comment_body:req.body.reply,
    });

    await Comment.findByIdAndUpdate(id2, {$push: {replies: comment._id }});
    comment.save();
    res.redirect(`/title/${id}`);
}



module.exports = {
    title_details,
    title_add_watch_later,
    rate,
    title_add_comment,
    title_reply_to_comment,
    title_add_favorite,
    title_add_watched
}