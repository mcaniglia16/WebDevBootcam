const express = require('express');
const router = express.Router();
const catchAsync = require('./../utils/catchAsync');
const Campground = require('./../models/campground');
const {isLoggedIn} = require('./../middleware')
const {isAuthor} = require('./../middleware')
const {validateCampground} = require('./../middleware')


router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
})


router.get('/new', isLoggedIn, (req, res) => {
    
    res.render('campgrounds/new');
})

//                          OUR VALIDATION MIDDLEWARE
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id
    await campground.save();
    req.flash('success', 'Successfully created a new campground');
    res.redirect(`campgrounds/${campground._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await (await Campground.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author"      //nested populate (how to populate 2 things: reviews and reviews author)
        }
        }).populate("author"));
    // console.log(campground)
    if(!campground){
        req.flash("error", "Cannot find that campground")
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
    
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const { id } = req.params;
    if(!campground){
        req.flash("error", "Cannot find that campground")
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}))

//                          OUR VALIDATION MIDDLEWARE
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const c = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success", "Successfully updated campgound");
    res.redirect(`/campgrounds/${c._id}`);
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully delete your campground");
    res.redirect('/campgrounds')
}))

module.exports = router;