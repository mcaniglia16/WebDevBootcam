const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user')

mongoose.connect('mongodb://localhost:27017/authDemo', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.send("This is the home page");
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    const hash = await bcrypt.hash(password, 12)
    const user = new User({
        username: username,
        password: hash
    });
    await user.save();
    res.redirect('/');
})

app.get('/secret', (req, res) => {
    res.send("You cannot see me unless you are logged in")
})

app.listen(3000, () => {
    console.log("On port 3000")
})