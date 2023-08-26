const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { cloudinary } = require('../cloudinary')

const FileSchema = new Schema({
    url: String,
    dateAdded: Date,
    fileName: String,
    name: String,
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Item'
    }
})

FileSchema.virtual('croppedUrl').get(function () {
    return this.url.replace('/upload', '/upload/c_crop,g_north,h_250')
})

FileSchema.post('findOneAndDelete', async (data) => {
    try {
        await cloudinary.uploader.destroy(data.fileName);
    } catch (e) {
        console.log('error in deleting')
        console.error(e)
    }
})

module.exports = mongoose.model('File', FileSchema)