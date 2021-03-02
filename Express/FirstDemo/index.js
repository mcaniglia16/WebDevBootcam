const { fileLoader } = require("ejs");
const express = require("express");
const app = express();
const path = require("path");
const redditData = require("./data.json")

app.use(express.static(path.join(__dirname, "/public")))

app.set("view engine", "ejs");
//              IMPORTANT
// __dirname = directory name of the current file (index.js)
// path.join appends /views to the current path
app.set("views", path.join(__dirname, "/views"))

app.get("/", (req, res) => {
    // res.send("HI");
    res.render("home.ejs");
})

app.get('/cats', (req, res) => {
    const cats = [
        "Blue", "Rocket", "Monty", "Stephanie", "Winston"
    ]
    res.render("cats", { cats })
})

app.get("/r/:subreddit", (req, res) => {
    const { subreddit } = req.params;
    const data = redditData[subreddit];
    // console.log(data);
    //                          spread
    if(data){
        res.render("subreddit", {...data });
    } else {
        res.render("notfound", {subreddit});
    }
    
})

app.get("/rand", (req, res) => {
    const num = Math.floor(Math.random() * 100) + 1;
    res.render("random", { rand: num} );
})

app.listen(3000, () => {
    console.log("Listening to port 3000");
})