const Movie = require("../models/movie");

const movies_page = async (req, res) => {
    const movies = await Movie.find();
    console.log(movies);
    res.render('movies', {movies});
}

module.exports = {
    movies_page
}
