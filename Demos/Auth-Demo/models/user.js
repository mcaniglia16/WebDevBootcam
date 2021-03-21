const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.statics.findAndValidate = async function (username, password) {
     const foundUser = await this.findOne({username});
     const valid = await bcrypt.compare(password, foundUser.password);
     return valid ? foundUser : false;
}

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

module.exports = mongoose.model("User", userSchema);