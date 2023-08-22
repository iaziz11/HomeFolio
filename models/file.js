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

FileSchema.virtual('croppedUrl').get(function () {
    return this.url.replace('/upload', '/upload/c_crop,g_north,h_250')
})

module.exports = mongoose.model('File', FileSchema)