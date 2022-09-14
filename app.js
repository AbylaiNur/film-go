const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');

const MongoStore = require('connect-mongo');

const signupRouter = require('./routes/signupRoutes');
const adminRouter = require('./routes/adminPanelRoutes');
const profileRouter = require('./routes/profileRoutes');
const postersRouter = require('./routes/postersRoutes');
const titleRouter = require('./routes/titleRoutes');
const loginRouter = require('./routes/loginRoutes');
const logoutRouter = require('./routes/logoutRoutes');
const moviesRouter = require('./routes/moviesRouter');

// JpLleJ07d6ziqqM0
const db_Url = 'mongodb+srv://abylai:JpLleJ07d6ziqqM0@cluster0.oyjeix1.mongodb.net/test';

const api_key = "9db36715f42a504baccc657a0d88c924";
// model for User
const User = require('./models/user');
const Movie = require('./models/movie');
const {maxAge} = require("express-session/session/cookie");


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded( { extended: true} ));
// creating a session

// connecting to the db




mongoose.connect(db_Url, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(process.env.PORT || 3000))
    .catch((err) => console.log(err));

app.use(session({
    secret: 'my key',
    resave: 'false',
    saveUninitialized: 'false',
    store: MongoStore.create({
        mongoUrl: db_Url
    })
}));




app.get('/', async (req, res) => {
    res.redirect('movies');
});
//
app.use('/login', loginRouter);

//
app.use('/logout', logoutRouter);

// Title router
app.use('/title', titleRouter);

// Posters router
app.use('/movies', moviesRouter);

// Sing Up router
app.use('/signup', signupRouter);

// Admin panel router
app.use('/adminPanel', adminRouter);

//
app.use('/profile', profileRouter);

app.use((req, res) => {
    res.status(404).render('404');
});

