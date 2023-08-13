const Item = require('../models/item');

module.exports.addItem = async (req, res) => {
    const item = new Item(req.body.item);
    await item.save()
}