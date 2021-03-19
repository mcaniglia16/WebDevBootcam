const express = require("express");
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const Product = require("./models/product");
const methodOverride = require('method-override');
const Farm = require('./models/farm');

const session = require('express-session');
const flash = require('connect-flash')

const sessionOptions = {
    secret: 'notasafesecret',
    resave: false,
    saveUninitialized: false
}

mongoose.connect('mongodb://localhost:27017/farmStandTake2', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo Connection Open")
    })
    .catch(err => {
        console.log("Oh no Mongo connection ERROR", err)
    })


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session(sessionOptions));
app.use(flash());

/*///////////////////////////////////////////
                MIDDLEWARE
*////////////////////////////////////////////
//allows EVERY template to have access to the flash messages without having to pass req.flash('..') to every single res.render
app.use((req, res, next) => {
    res.locals.messages = req.flash('success');
    next();
})

/*///////////////////////////////////////////
                FARM ROUTES
*////////////////////////////////////////////
app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/farms', { farms, messages: req.flash('success')  })
})
app.get('/farms/new', (req, res) => {
    res.render('farms/new')
})
app.get('/farms/:id', async (req, res) => {
    const farm = await Farm.findById(req.params.id).populate('products');
    // console.log(farm);
    res.render('farms/show', { farm})
})

app.delete('/farms/:id', async (req, res) => {
    const farm = await Farm.findByIdAndDelete(req.params.id);

    res.redirect('/farms');
})

app.post('/farms', async (req, res) => {
    const farm = new Farm(req.body);
    await farm.save();
    req.flash('success', "You've made a new farm");
    res.redirect('/farms')
})

app.get('/farms/:id/products/new', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    res.render('products/new', { categories, farm })
})

app.post('/farms/:id/products', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    const { name, price, category } = req.body;
    const product = new Product({ name, price, category });
    farm.products.push(product);
    product.farm = farm;
    await farm.save();
    await product.save();
    console.log(farm);
    res.redirect(`/farms/${id}`)
})

/*///////////////////////////////////////////
               PRODUCT ROUTES
*////////////////////////////////////////////
const categories = ['fruit', 'vegetable', 'dairy'];

app.get('/products', async(req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category });
        res.render('products/index', { products, category });
    } else {
        const products = await Product.find({});
        res.render('products/index', { products, category: "All" });
    }
    // console.log(products);
    // res.send("All products will be here")
})

app.get('/products/new', (req, res) => {
    res.render('products/new', { categories });
})

app.post('/products', async(req, res) => {
    const newProduct = await new Product(req.body); // this data is not validated!
    await newProduct.save();
    console.log(newProduct);
    res.redirect('/products');
})

app.get('/products/:id', async(req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('farm');
    console.log(product);
    // res.send('Details page!');
    res.render('products/details', { product, id });
})

app.get('/products/:id/edit', async(req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories });
})

app.delete('/products/:id', async(req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

app.put('/products/:id', async(req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/products/${product._id}`)
})

app.listen(3000, () => {
    console.log("Live on port 3000");
})