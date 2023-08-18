const File = require('../models/file');
const Item = require('../models/item');
const Expense = require('../models/expense');
const axios = require('axios')
const FormData = require('form-data');

const apiKey = process.env.MINDEE_API_KEY;
const account = "mindee";
const endpoint = "expense_receipts";
const version = "5";

async function uploadImageMindee(filePath) {
    let data = new FormData();
    data.append("document", filePath);
    const config = {
        method: "POST",
        url: `https://api.mindee.net/v1/products/${account}/${endpoint}/v${version}/predict`,
        headers: {
            Authorization: `Token ${apiKey}`,
            ...data.getHeaders()
        },
        data
    }
    try {
        let response = await axios(config)
        return response.data.document.inference.prediction;
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
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
    const currentItem = await Item.findById(itemId);
    const newFile = new File(req.body.file);
    newFile.url = req.file.path;
    newFile.fileName = req.file.filename;
    newFile.dateAdded = Date.now();
    currentItem.files.push(newFile._id);
    newFile.item = itemId;
    await newFile.save()
    if (req.body.isExpense === 'true') {
        const tempUrl = 'https://i.pinimg.com/550x/5d/02/c9/5d02c94582f07a3b07e60647723eadc3.jpg'
        const mindeeResponse = await uploadImageMindee(tempUrl);
        const newExpense = new Expense({ value: mindeeResponse.total_amount.value, item: itemId, file: newFile._id })
        currentItem.expenses.push(newExpense);
        await newExpense.save();
    }
    await currentItem.save();
    res.redirect('/items');
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