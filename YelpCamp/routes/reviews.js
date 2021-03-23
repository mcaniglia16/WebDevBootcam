const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('./../utils/catchAsync');
const Review = require('./../models/review');
const Campground = require('./../models/campground');
const {validateReview} = require('./../middleware');
const {isLoggedIn} = require('./../middleware');
const {isReviewAuthor} = require('./../middleware')

//                                  OUR VALIDATION MIDDLEWARE
router.post("/", isLoggedIn, validateReview, catchAsync(async(req, res) => {
    const campground = await (await Campground.findById(req.params.id));
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Thank you for your review!");
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
    // const {id, reviewId}
    await Campground.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.reviewId}});
    await Review.findByIdAndDelete(req.params.reviewID);
    req.flash("success", "Successfully delete your review ... :(");
    res.redirect(`/campgrounds/${req.params.id}`)
}))

module.exports = router;