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


const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    season: {
        type: String,
        enum: ['Spring', 'Summer', 'Fall', 'Winter']
    }
});
const farmSchema = new mongoose.Schema({
    name: String, 
    city: String,
    products: [
        { type: Schema.Types.ObjectId, ref: 'Product' }
        //                              ^ Very important
        // now if we call .populate('products') mongoose will automatically take the ID's in the products array and get the data from the Product model and populate the array with the product objects
    ]
});

const Product = new mongoose.model('Product', productSchema);
const Farm = new mongoose.model('Farm', farmSchema);

// Product.insertMany([
//     {name: 'Melon', price: 4.99, season: 'Summer'},
//     {name: 'Apple', price: 0.99, season: 'Fall'},
//     {name: 'Asparagus', price: 2.99, season: 'Spring'}
// ])

const makeFarm = async () => {
    const farm = new Farm({
        name: "Full Belly Farms",
        city: "Guinda, CA",
    });
    const apple = await Product.findOne({name: 'Apple'});
    farm.products.push(apple);
    await farm.save();
    console.log(farm);
};

// makeFarm();

const addProduct = async () => {
    const farm = await Farm.findOne({name: 'Full Belly Farms'});
    const melon = await Product.findOne({name: 'Melon'});
    farm.products.push(melon);
    farm.save();
    // console.log(farm)
}

addProduct();

Farm.findOne({name: 'Full Belly Farms'})
.populate('products')
.then(farm => console.log(farm))