const Campground = require('./../models/campground');
const {cloudinary} = require('../cloudinary');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id
    await campground.save();
    console.log(campground)
    req.flash('success', 'Successfully created a new campground');
    res.redirect(`campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
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
}

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const { id } = req.params;
    if(!campground){
        req.flash("error", "Cannot find that campground")
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    // console.log(req.body)
    const c = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    c.images.push(...imgs);    //spread the imgs array onto campground.images
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await c.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    await c.save();
    req.flash("success", "Successfully updated campgound");
    res.redirect(`/campgrounds/${c._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully delete your campground");
    res.redirect('/campgrounds')
}

