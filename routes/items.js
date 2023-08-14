const express = require('express');
const router = express.Router();
const items = require('../controllers/items');
const { isLoggedIn } = require('../utils/utils');

router.route('/')
    .get(isLoggedIn, items.getItems)
    .post(isLoggedIn, items.addItem)

router.route('/:id')
    .get(isLoggedIn, items.getItem)
    .put(isLoggedIn, items.editItem)
    .delete(isLoggedIn, items.deleteItem)

module.exports = router;