var express = require('express');
var router = express.Router();

const files = []

router.get('/', (req, res) => {
    //fetch all files from database
    res.send(files)
})

router.get('/:id', (req, res) => {
    //fetch one file from database
    const { id } = req.params;
    res.send(files[id])
})

router.post('/', (req, res) => {
    //add file to database
    const newFile = req.body;
    console.log(req.body);
    files.push(newFile);
    res.send('Added File');
})

router.put('/:id', (req, res) => {
    //update file
    const newFile = req.body;
    const { id } = req.params;
    files[id] = newFile;
    res.send('Successfully updated')
})

router.delete('/:id', (req, res) => {
    //delete file
    const { id } = req.params;
    files.splice(id, 1);
    res.send('Successfully deleted')
})

module.exports = router;