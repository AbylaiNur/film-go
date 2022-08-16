const User = require("../models/user");
const Movie = require("../models/movie")

const admin_panel_index = async (req, res) => {
    let result = await User.find().sort({'name': 1});
    let movies = await Movie.find();

    res.render('adminPanel', {users: result, user: req.session.user, movies : movies});
}

const add_user_page = (req, res) => {
    res.render('addUser', {user: req.session.user});
}

const add_user = async (req, res) => {
    const user = new User(req.body);
    user.time = new Date().getTime();
    user.watchLater = [];
    user.role = "user";
    let user2 = await User.findOne({'username': user.username});
    if (user2) {
        return res.redirect('/adminPanel/addUser');
    }
    await user.save();
    res.redirect('/adminPanel');
}

const edit_user_page = async (req, res) => {
    const id = req.params.id;
    let user = await User.findById(id);
    res.render('editUser', {user});
}

const edit_user = async (req, res) => {
    const id = req.params.id;
    const user = req.body;
    await User.findByIdAndUpdate(id, user);
    res.redirect('/adminPanel');
}

const add_movie = async (req, res) => {
    const movie = new Movie(req.body);
    movie.image = ({
        data:req.file.filename,
        contentType:'image/jpg'
    });
    await movie.save();
    res.redirect('/adminPanel');
}

const edit_movie_page = async (req, res) => {
    const id = req.params.id;
    let movie = await Movie.findById(id);
    res.render('editMovie',{movie});
}

const edit_movie = async (req, res) => {
    const id=req.params.id;
    const movie = new Movie(req.body);
    movie.image = ({
        data:req.file.filename,
        contentType:'image/jpg'
    });
    await Movie.findByIdAndUpdate(id, movie);
    res.redirect('/adminPanel');
}

const delete_movie = async (req, res) => {

    await Movie.findByIdAndDelete(req.params.id);
    res.redirect('/adminPanel');
}

module.exports = {
    admin_panel_index,
    add_user_page,
    add_user,
    edit_user_page,
    edit_user,
    add_movie,
    edit_movie_page,
    edit_movie,
    delete_movie
}