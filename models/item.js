const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: String,
    icon: String
})

module.exports = mongoose.model('Item', ItemSchema)