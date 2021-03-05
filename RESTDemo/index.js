const express = require("express");
const app = express();
const path = require('path');
const { v4 : uuid } = require("uuid");
const methodOverride = require("method-override");

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(methodOverride("_method"))

app.set('views', path.join(__dirname, "views"))
app.set("view engine", 'ejs');

const comments = [
    {
        username: "Todd",
        comment: "lol that is so funny!",
        id: uuid()
    },
    {
        username: "John",
        comment: "I need help with my Math homework",
        id: uuid()
    },
    {
        username: "Todd",
        comment: "I'm not helping you sorry John",
        id: uuid()
    },
    {
        username: "Melissa",
        comment: "hey guys! I just got an internship",
        id: uuid()
    },
    {
        username: "John",
        comment: "@Melissa oh word? Where",
        id: uuid()
    },
    {
        username: "Melissa",
        comment: "at SSENSE :) i'm really excited",
        id: uuid()
    },
]

//INDEX route
app.get("/comments", (req, res) => {
    res.render("comments/index", {comments})
})

app.get("/comments/new", (req, res) => {
    res.render("comments/new")
})

//POST route
app.post("/comments", (req, res) => {
    const {username, comment} = req.body;
    comments.push({username, comment, id: uuid()});
    // console.log(req.body);
    // res.send("It worked");
    res.redirect("/comments");
})

// SHOW route
app.get("/comments/:id", (req, res) => {
    const { id } = req.params;
    // we store id as an int in the comments, but id here is a string
    const comment = comments.find(c => c.id === id);
    res.render('comments/show', { comment })
})

//UPDATE route
app.patch('/comments/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body.comment;
    const foundComment = comments.find(c => c.id === id);
    foundComment.comment = updates;
    res.redirect('/comments');
})
app.get('/comments/:id/edit', (req, res) => {
    const { id } = req.params;
    const comment = comments.find(c => c.id === id);
    res.render('comments/edit', {comment});
})

app.get('/tacos', (req, res) => {
    res.send("Get /tacos response");
})

app.post('/tacos', (req, res) => {
    const {meat, qty} = (req.body)
    res.send(`OK, here are your ${qty} ${meat} tacos`);
})

app.listen(3000, () => {
    console.log("On port 3000")
}) 