const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');
const Review = require('./models/review');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const {campgroundSchema, reviewSchema} = require('./schemas.js');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
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
app.use(express.static('public'))

//ROUTES
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
app.use('/campgrounds', campgrounds);           //prefix all routes in campgrounds.js with /campgrounds
app.use('/campgrounds/:id/reviews', reviews);   //prefix all routes in reviews.js with /reviews

/////////////////////
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