/*
    File we run anytime we want to put data into the database
*/
const mongoose = require("mongoose");
const Product = require("./models/product");

mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo Connection Open")
    })
    .catch(err => {
        console.log("Oh no Mongo connection ERROR", err)
    })

const seedProducts = [{
        name: "Ruby Grapefruit",
        price: 1.99,
        category: 'fruit'
    },
    {
        name: "Apple",
        price: 0.50,
        category: 'fruit'
    },
    {
        name: "Corn",
        price: 1.75,
        category: 'vegetable'
    },
    {
        name: "Cilantro",
        price: 1.25,
        category: 'vegetable'
    },
    {
        name: "Mango",
        price: 2.10,
        category: 'fruit'
    },
    {
        name: "Berries",
        price: 3.99,
        category: 'fruit'
    },
    {
        name: "Choccy milk",
        price: 3.99,
        category: 'dairy'
    },
    {
        name: "Goat cheese",
        price: 5.99,
        category: 'dairy'
    },
    {
        name: "Pears",
        price: 2.99,
        category: 'fruit'
    }
];

// p.save()
// .then( p => {
//     console.log(p);
// })
// .catch(e => {
//     console.log(e);
// })


Product.insertMany(seedProducts)
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })