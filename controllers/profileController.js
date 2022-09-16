const User = require("../models/user");
const axios = require("axios");


const profile_the_user = async (req, res) => {
    let idsWatchLater = req.session.user.watchLater;
    let idsFavorite = req.session.user.favorite;
    let idsWatched = req.session.user.watched;
    let moviesWatchLater = [];
    let moviesFavorite = [];
    let moviesWatched = [];
    req.session.user = await User.findById(req.session.user._id);
    for (let i = 0; i < idsWatchLater.length; i++) {
        let id = idsWatchLater[i];
        moviesWatchLater[i] = (await axios(`https://api.themoviedb.org/3/movie/${id}?api_key=9db36715f42a504baccc657a0d88c924&language=en-US`)).data;;
    }
    for (let i = 0; i < idsFavorite.length; i++) {
        let id = idsFavorite[i];
        moviesFavorite[i] = (await axios(`https://api.themoviedb.org/3/movie/${id}?api_key=9db36715f42a504baccc657a0d88c924&language=en-US`)).data;;
    }
    for (let i = 0; i < idsWatched.length; i++) {
        let id = idsWatched[i];
        moviesWatched[i] = (await axios(`https://api.themoviedb.org/3/movie/${id}?api_key=9db36715f42a504baccc657a0d88c924&language=en-US`)).data;;
    }
    res.render('profileUser', {user: req.session.user, moviesWatchLater, moviesFavorite, moviesWatched});
}

const profile_id = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    let idsWatchLater = user.watchLater;
    let idsFavorite = user.favorite;
    let idsWatched = user.watched;
    let moviesWatchLater = [];
    let moviesFavorite = [];
    let moviesWatched = [];
    for (let i = 0; i < idsWatchLater.length; i++) {
        let id = idsWatchLater[i];
        moviesWatchLater[i] = (await axios(`https://api.themoviedb.org/3/movie/${id}?api_key=9db36715f42a504baccc657a0d88c924&language=en-US`)).data;;
    }
    for (let i = 0; i < idsFavorite.length; i++) {
        let id = idsFavorite[i];
        moviesFavorite[i] = (await axios(`https://api.themoviedb.org/3/movie/${id}?api_key=9db36715f42a504baccc657a0d88c924&language=en-US`)).data;;
    }
    for (let i = 0; i < idsWatched.length; i++) {
        let id = idsWatched[i];
        moviesWatched[i] = (await axios(`https://api.themoviedb.org/3/movie/${id}?api_key=9db36715f42a504baccc657a0d88c924&language=en-US`)).data;;
    }
    res.render('profile', {user: user, moviesWatchLater, moviesFavorite, moviesWatched});
}

const edit_user_page = async (req, res) => {
    const id = req.session.user._id;
    let user = await User.findById(id);
    res.render('editTheUser', {user});
}

const edit_user = async (req, res) => {
    const id = req.session.user._id;
    const user = req.body;
    await User.findByIdAndUpdate(id, user);
    res.redirect('/profile');
}

const profile_to_login = (req, res) => {
    res.redirect('login');
}

const profile_to_admin_panel = (req, res) => {
    res.redirect('adminPanel');
}


const profile_delete = (req, res) => {

    User.findByIdAndDelete(req.params.id)
        .then(result => {
            res.json( {redirect : '/adminPanel'} )
        })
        .catch((err) => console.log(err));
}

module.exports = {
    profile_id,
    profile_delete,
    profile_the_user,
    profile_to_login,
    profile_to_admin_panel,
    edit_user_page,
    edit_user
}