const File = require('../models/File');
const Item = require('../models/item');

module.exports.getFiles = async (req, res) => {
    const { itemId } = req.params;
    const currentItem = await Item.findById(itemId);
    const files = await File.find({ _id: { $in: currentItem.files } });
    res.send(files);
}

module.exports.getFile = async (req, res) => {
    const { id } = req.params;
    const file = await File.findById(id);
    res.send(file);
}

module.exports.addFile = async (req, res) => {
    const { itemId } = req.params;
    const file = new File(req.body.file);
    const currentItem = await Item.findById(itemId);
    currentItem.files.push(file._id);
    file.item = currentItem._id;
    await file.save()
    await currentItem.save();
    res.redirect(`${itemId}/files`);
}

module.exports.editFile = async (req, res) => {
    const { id } = req.params;
    const newFile = req.body.file;
    const file = await File.findByIdAndUpdate(id, newFile, { new: true, runValidators: true });
    res.send(file);
}

module.exports.deleteFile = async (req, res) => {
    const { id, itemId } = req.params;
    await File.findByIdAndDelete(id);
    await Item.findByIdAndUpdate(itemId, { $pull: { files: id } });
    res.redirect(`${itemId}/files`);
}