const express = require('express');
const router = express.Router({ mergeParams: true });
const files = require('../controllers/files');
const { isLoggedIn } = require('../utils');
const { validateFile } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(isLoggedIn, files.getFiles)
    .post(isLoggedIn, upload.single('uploadFile'), validateFile, files.addFile)

router.route('/:id')
    .get(isLoggedIn, files.getFile)
    .put(isLoggedIn, validateFile, files.editFile)
    .delete(isLoggedIn, files.deleteFile)

module.exports = router;