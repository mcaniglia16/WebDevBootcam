const Campground = require('./../models/campground');
const Review = require('./../models/review');
const User = require('./../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('auth/register')
}

module.exports.register = async (req, res, next) => {
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
}

module.exports.renderLogin = (req, res) => {
    res.render('auth/login')
}

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectURL = req.session.returnTo || '/campgrounds'; //remember the link where the user was trying to go before being interrupted by login page
    delete req.session.returnTo;
    res.redirect(redirectURL);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!")
    res.redirect('/campgrounds');
}