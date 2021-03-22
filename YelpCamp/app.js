const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisShouldBeABetterSecret',
    resave: false,
    saveUninitialiazed: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:  1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser()); //tells passport how to store a user in the session
passport.deserializeUser(User.deserializeUser()); //tells passport how to get user out of the session


///////////////////// FLASH MIDDLEWARE
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.signedInUser = req.user;
    next();
})

///////////////////// ROUTES
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const authRoutes = require('./routes/auth');

app.use('/campgrounds', campgroundRoutes);           //prefix all routes in campgrounds.js with /campgrounds
app.use('/campgrounds/:id/reviews', reviewRoutes);   //prefix all routes in reviews.js with /reviews
app.use('/', authRoutes);

app.get('/fakeUser', async (req, res) => {
    const user = new User({email: 'marco@gmail.com', username: 'mcanig'});
    const newUser = await User.register(user, 'charlie');
    res.send(newUser)
})

app.get('/', (req, res) => {
    res.render('home');
})

//Order is very important: this will only run if no other route matched first
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong"
    res.status(statusCode);
    // res.send(message);
    res.render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})