const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const sesion = require('express-session');

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
app.use(express.urlencoded({extended: true}));
app.use(sesion({secret: 'notagoodsecret'}));

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
    req.session.user_id = user._id;
    res.redirect('/');
})

app.get('/login', (req,res) => {
    res.render('login');
})

app.post('/login', async (req,res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username: username});
    const valid = await bcrypt.compare(password, user.password);
    if(!user || !valid) {
        res.redirect("/login")
    } else {
        req.session.user_id = user._id;
        res.redirect('/secret')
    }
})

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    req.session.destroy();
    res.redirect('/login');
})

app.get('/secret', (req, res) => {
    if(!req.session.user_id){
        return res.redirect('/login');
    }
    res.render('secret')
})

app.listen(3000, () => {
    console.log("On port 3000")
})