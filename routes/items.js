const express = require('express');
const router = express.Router();
const items = require('../controllers/items');
const { isLoggedIn } = require('../utils');
const { validateItem } = require('../middleware');

router.route('/')
    .get(isLoggedIn, items.getItems)
    .post(isLoggedIn, validateItem, items.addItem)

router.route('/:id')
    .get(isLoggedIn, items.getItem)
    .put(isLoggedIn, validateItem, items.editItem)
    .delete(isLoggedIn, items.deleteItem)

module.exports = router;