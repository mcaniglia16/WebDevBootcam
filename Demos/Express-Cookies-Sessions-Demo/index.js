const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const session = require('express-session');

const sessionOptions = {
    secret: 'notasafesecret',
    resave: false,
    saveUninitialized: false
}
app.use(session(sessionOptions));
app.use(cookieParser('secret'));

app.get('/viewCount', (req, res) => {
    if(req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send(`You have viewed this page ${req.session.count} times`)
})

app.get('/register', (req, res) => {
    const {username = "Anonymous"} = req.query;
    req.session.username = username;
    res.redirect('/greet')
})

app.get('/greet', (req, res) => {
    // console.log(req.cookies)
    // const { username = "Anonymous"} = req.cookies;
    const { username = "Anonymous"} = req.session;
    res.send(`Welcome back, ${username}`)
})

app.get('/setName', (req, res) => {
    res.cookie('name', 'Marco');
    res.cookie('animal', 'Chicken');
    res.send("Ok, sent you a cookie")
})

app.get('/getSignedCookie', (req, res) => {
    res.cookie('fruit', 'grape', {signed: true})
    res.send('I just siged this stupid cookie...')
})

app.get('/verifyFruit', (req, res) => {
    res.send(req.signedCookies)
})

app.listen(3000, () => {
    console.log("On port 3000")
})