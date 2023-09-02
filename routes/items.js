const express = require('express');
const router = express.Router();
const items = require('../controllers/items');
const { isLoggedIn } = require('../utils');
const { validateItem, wrapAsync } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(isLoggedIn, wrapAsync(items.getItems))
    .post(isLoggedIn, upload.single('uploadFile'), validateItem, wrapAsync(items.addItem))

router.route('/:id')
    .get(isLoggedIn, wrapAsync(items.getItem))
    .put(isLoggedIn, upload.single('uploadFile'), validateItem, wrapAsync(items.editItem))
    .delete(isLoggedIn, wrapAsync(items.deleteItem))

module.exports = router;