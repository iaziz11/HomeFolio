const express = require('express');
const router = express.Router();
const items = require('../controllers/items');
const { isLoggedIn } = require('../utils');
const { validateItem } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(isLoggedIn, items.getItems)
    .post(isLoggedIn, upload.single('uploadFile'), validateItem, items.addItem)

router.route('/:id')
    .get(isLoggedIn, items.getItem)
    .put(isLoggedIn, upload.single('uploadFile'), validateItem, items.editItem)
    .delete(isLoggedIn, items.deleteItem)

module.exports = router;