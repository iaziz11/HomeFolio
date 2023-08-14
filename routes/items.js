const express = require('express');
const router = express.Router();
const items = require('../controllers/items')

router.route('/')
    .get(items.getItems)
    .post(items.addItem)

router.route('/:id')
    .get(items.getItem)
    .put(items.editItem)
    .delete(items.deleteItem)

module.exports = router;