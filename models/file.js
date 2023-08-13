const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    url: String,
    dateAdded: Date,
    fileName: String,
    description: String,
    expense: String,
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Item'
    }
})

module.exports = mongoose.model('File', fileSchema)