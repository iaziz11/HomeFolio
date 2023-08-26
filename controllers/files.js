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
    res.locals.itemId = itemId;
    const currentItem = await Item.findById(itemId);
    const files = await File.find({ _id: { $in: currentItem.files } });
    res.render('items/files', { files });
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
    await currentItem.save();
    if (req.body.isExpense === 'true') {
        try {
            const mindeeResponse = await uploadImageMindee(req.file.path);
            if (!mindeeResponse.total_amount.value) {
                throw new Error()
            }
            const value = Math.round(mindeeResponse.total_amount.value * 100);
            console.log(mindeeResponse)
            const newExpense = new Expense({ value, item: itemId, file: newFile._id, name: req.body.file.name, date: Date.now() })
            currentItem.expenses.push(newExpense);
            await newExpense.save();
            await currentItem.save();
        } catch {
            req.flash('error', 'File added, but expense could not be parsed');
            res.send('No expense');
            return
        }
    }
    req.flash('success', 'Added file successfully')
    res.send('Added');
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
    req.flash('success', 'Successfully deleted file')
    res.send('Deleted');
}