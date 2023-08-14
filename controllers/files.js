const File = require('../models/File');

module.exports.getFiles = async (req, res) => {
    const files = await File.find({});
    res.send(files);
}

module.exports.getFile = async (req, res) => {
    const { id } = req.params;
    const file = await File.findById(id);
    res.send(file);
}

module.exports.addFile = async (req, res) => {
    const file = new File(req.body.file);
    await file.save()
    res.send('Added File');
}

module.exports.editFile = async (req, res) => {
    const { id } = req.params;
    const newFile = req.body.file;
    const file = await File.findByIdAndUpdate(id, newFile, { new: true, runValidators: true });
    res.send(file);
}

module.exports.deleteFile = async (req, res) => {
    const { id } = req.params;
    await File.findByIdAndDelete(id);
    res.redirect('/files')
}