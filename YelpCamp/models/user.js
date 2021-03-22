const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})
//adds on to our userSchema a username and a passport
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);