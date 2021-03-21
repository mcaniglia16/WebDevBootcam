const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('./../utils/catchAsync');
const ExpressError = require('./../utils/ExpressError');
const Review = require('./../models/review');
const Campground = require('./../models/campground');
const {reviewSchema} = require('./../schemas.js');

///////////////////JOI SERVER SIDE DATA VALIDATION MIDDLEWARE
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//                                  OUR VALIDATION MIDDLEWARE
router.post("/", validateReview, catchAsync(async(req, res) => {
    const campground = await (await Campground.findById(req.params.id));
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Thank you for your review!");
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete("/:reviewId", catchAsync(async(req, res) => {
    // const {id, reviewId}
    await Campground.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.reviewId}});
    await Review.findByIdAndDelete(req.params.reviewID);
    req.flash("success", "Successfully delete your review ... :(");
    res.redirect(`/campgrounds/${req.params.id}`)
}))

module.exports = router;