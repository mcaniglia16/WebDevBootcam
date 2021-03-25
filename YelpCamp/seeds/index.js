const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0; i<25; i++)
    {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 50);
        const camp = new Campground({
            author: "6057ec0233f37e3710196cf3",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dc2wtilcq/image/upload/v1616520738/YelpCamp/f6rlmtmvtotsbmxiy6qo.jpg',
                  filename: 'YelpCamp/f6rlmtmvtotsbmxiy6qo'
                },
                {
                  url: 'https://res.cloudinary.com/dc2wtilcq/image/upload/v1616520737/YelpCamp/rwzeyidwjxl4wwageckd.jpg',
                  filename: 'YelpCamp/rwzeyidwjxl4wwageckd'
                },
                {
                  url: 'https://res.cloudinary.com/dc2wtilcq/image/upload/v1616520738/YelpCamp/o2jnnidadk5oljpsyzwe.jpg',
                  filename: 'YelpCamp/o2jnnidadk5oljpsyzwe'
                },
                {
                  url: 'https://res.cloudinary.com/dc2wtilcq/image/upload/v1616520739/YelpCamp/hf0vvakrqisgyt4ubp62.jpg',
                  filename: 'YelpCamp/hf0vvakrqisgyt4ubp62'
                }
              ],
            geometry: { "type" : "Point", "coordinates" : [ -123.1139, 49.2609 ] },
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil sit itaque harum mollitia culpa distinctio quidem nam a delectus, dolorem ab in maiores, molestiae odio, libero inventore consequuntur ipsa iste?',
            price: price
        });
        // console.log(camp);
        await camp.save();
    }
}

seedDB()
.then(()=>{
    mongoose.connection.close();
})
