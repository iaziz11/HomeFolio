const express = require('express');
const router = express.Router();
const files = require('../controllers/files');
const { isLoggedIn } = require('../utils/utils');

router.route('/')
    .get(isLoggedIn, files.getFiles)
    .post(isLoggedIn, files.addFile)

router.route('/:id')
    .get(isLoggedIn, files.getFile)
    .put(isLoggedIn, files.editFile)
    .delete(isLoggedIn, files.deleteFile)

module.exports = router;