const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
    url: String,
    dateAdded: Date,
    fileName: String,
    description: String,
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Item'
    }
})

module.exports = mongoose.model('File', FileSchema)