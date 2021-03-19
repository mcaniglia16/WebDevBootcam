const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("All Shelters")
})
router.post('/', (req, res) => {
    res.send("Creating a Shelter")
})
router.get('/:id', (req, res) => {
    res.send("Viewing One Shelter")
})
router.get('/:id/edit', (req, res) => {
    res.send("Editing One Shelter")
})

module.exports = router;