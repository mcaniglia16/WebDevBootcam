const express = require("express");
const app = express();
const morgan = require('morgan');

app.use(morgan('common'));
app.use((req, res, next)=> {
    req.requestTime = Date.now();
    console.log(req.method, req.path );
    next();
})

app.use('/dogs', (req, res, next)=> {
    console.log('I love dogs');
    next();
})

const verifyPassword = (req, res, next) => {
    // console.log(req.query);
    const {password} = req.query;
    if(password === "pword"){
        next()
    }
    res.send('Sorry you need a password');
};

app.get('/', (req, res) => {
    res.send("Home page")
})

app.get('/dogs', (req, res) => {
    console.log(`Request Date: ${req.requestTime}`)
    res.send("Woof")
})

app.get('/secret', verifyPassword,  (req, res) => {
    res.send("I farted");
})

app.use((req, res) => {
    res.send("404 Error")
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})