const Item = require("../models/item");

module.exports.getItems = async (req, res) => {
  const items = await Item.find({ user: req.user._id }).populate("user");
  res.locals.itemId = undefined;
  res.render("items/show", { items });
};

module.exports.getItem = async (req, res) => {
  const { itemId } = req.params;
  const item = await Item.findById(itemId);
  res.send(item);
};

module.exports.addItem = async (req, res) => {
  const item = new Item(req.body.item);
  item.user = req.user._id;
  if (req.file) {
    item.icon = req.file.path;
  }
  await item.save();
  req.flash("success", "Successfully added item!");
  res.send("Added item");
};

module.exports.editItem = async (req, res) => {
  const { itemId } = req.params;
  const newItem = req.body.item;
  if (req.file) {
    newItem.icon = req.file.path;
  }
  const item = await Item.findByIdAndUpdate(itemId, newItem, {
    new: true,
    runValidators: true,
  });
  req.flash("success", "Successfully edited item!");
  res.send("Edited");
};

module.exports.deleteItem = async (req, res) => {
  const { itemId } = req.params;
  await Item.findByIdAndDelete(itemId);
  req.flash("success", "Successfully deleted item!");
  res.send("Deleted");
};
