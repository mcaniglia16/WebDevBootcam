const mongoose = require('mongoose');

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

const userSchema = new mongoose.Schema({
    first: String,
    last: String,
    addresses: [
        {
            _id: {id: false}, 
            street: String,
            city: String,
            state: String,
            country: String
        }
    ]
})

const User = mongoose.model('User', userSchema);

const makeUser = async () => {
    const u = new User({
        first: 'Harry',
        last: 'Potter'
    })
    u.addresses.push({
        street: '123 Sesame Street',
        city: 'New York',
        state: 'NY',
        country: 'USA'
    })
    const res = await u.save();
    console.log(res)
}

makeUser();