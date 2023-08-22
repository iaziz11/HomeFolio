const Item = require('../models/item');

module.exports.getItems = async (req, res) => {
    const items = await Item.find({ user: req.user._id }).populate('user');
    console.log(items)
    res.render('items/show', { items });
}

module.exports.getItem = async (req, res) => {
    const { id } = req.params;
    const item = await Item.findById(id);
    res.send(item);
}

module.exports.addItem = async (req, res) => {
    console.log(req.body.item)
    const item = new Item(req.body.item);
    item.user = req.user._id;
    await item.save();
    res.redirect('/items');
}

module.exports.editItem = async (req, res) => {
    const { id } = req.params;
    const newItem = req.body.item;
    const item = await Item.findByIdAndUpdate(id, newItem, { new: true, runValidators: true });
    res.send(item);
}

module.exports.deleteItem = async (req, res) => {
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    res.redirect('/items')
}
