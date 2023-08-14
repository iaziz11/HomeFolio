const express = require('express');
const router = express.Router();
const files = require('../controllers/files')

router.route('/')
    .get(files.getFiles)
    .post(files.addFile)

router.route('/:id')
    .get(files.getFile)
    .put(files.editFile)
    .delete(files.deleteFile)

module.exports = router;