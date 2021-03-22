const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const catchAsync = require('./../utils/catchAsync');
const passport = require("passport");

router.get('/register', (req, res) => {
    res.render('auth/register')
})

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        // console.log(registeredUser);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', `Welcome to Yelpcamp ${username}!`)
            res.redirect('/campgrounds');
        });
    } catch (err) {
        req.flash('error', err.message)
        res.redirect('/register');
    }
}))

router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectURL = req.session.returnTo || '/campgrounds'; //remember the link where the user was trying to go before being interrupted by login page
    delete req.session.returnTo;
    res.redirect(redirectURL);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!")
    res.redirect('/campgrounds');
})

module.exports = router;