const express = require('express');
const router = express.Router({ mergeParams: true });
const files = require('../controllers/files');
const { isLoggedIn } = require('../utils');
const { validateFile, wrapAsync } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(isLoggedIn, wrapAsync(files.getFiles))
    .post(isLoggedIn, upload.single('uploadFile'), validateFile, wrapAsync(files.addFile))

router.route('/:id')
    .get(isLoggedIn, wrapAsync(files.getFile))
    .put(isLoggedIn, validateFile, wrapAsync(files.editFile))
    .delete(isLoggedIn, wrapAsync(files.deleteFile))

module.exports = router;