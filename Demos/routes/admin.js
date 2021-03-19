const express = require('express');
const router = express.Router();

router.use((req, res, next)=> {
    if(req.query.isAdmin){
        next();
    }
    res.send("You do not have permission to view this page")
})

router.get('/topSecret', (req, res) => {
    res.send("This is private information")
})

router.get('/deleteEverything', (req, res) => {
    res.send("Boom, all gone")
})

module.exports = router;