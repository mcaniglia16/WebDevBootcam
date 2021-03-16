const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/relationshipDemo', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Database connected")
})
.catch(err => {
    console.log("Something went wrong");
    console.log(err)
})

const userSchema = new Schema({
    username: String,
    age: Number
})

const tweetSchema = new Schema({
    text: String,
    likes: Number,
    user: {type: Schema.Types.ObjectId, ref: 'User'}
})


const User = mongoose.model("User", userSchema);
const Tweet = mongoose.model("Tweet", tweetSchema);

const makeTweets = async () => {
    // const user = new User({username: 'ChickenFan99', age: 61});
    const user = await User.findOne({username: 'ChickenFan99'});
    const tweet2 = new Tweet({text: 'hey there', likes: 98});
    tweet2.user = user;
    // user.save();
    tweet2.save();
}
// makeTweets();

const findTweet = async () => {
    // const t = await Tweet.findOne({}).populate('user', 'username');
    const t = await Tweet.find({}).populate('user');

    console.log(t)
}

findTweet();