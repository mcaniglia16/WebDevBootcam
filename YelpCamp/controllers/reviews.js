const Campground = require('./../models/campground');
const Review = require('./../models/review');


module.exports.createReview = async(req, res) => {
    const campground = await (await Campground.findById(req.params.id));
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Thank you for your review!");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async(req, res) => {
    // const {id, reviewId}
    await Campground.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.reviewId}});
    await Review.findByIdAndDelete(req.params.reviewID);
    req.flash("success", "Successfully delete your review ... :(");
    res.redirect(`/campgrounds/${req.params.id}`)
}