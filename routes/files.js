const express = require('express');
const router = express.Router({ mergeParams: true });
const files = require('../controllers/files');
const { isLoggedIn } = require('../utils/utils');
const { validateFile } = require('../middleware/validateInputs');

router.route('/')
    .get(isLoggedIn, files.getFiles)
    .post(isLoggedIn, validateFile, files.addFile)

router.route('/:id')
    .get(isLoggedIn, files.getFile)
    .put(isLoggedIn, validateFile, files.editFile)
    .delete(isLoggedIn, files.deleteFile)

module.exports = router;