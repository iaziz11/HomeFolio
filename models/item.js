const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: String,
    icon: String,
    expenses: {
        type: [Schema.Types.ObjectId],
        ref: 'Expenses'
    },
    files: {
        type: [Schema.Types.ObjectId],
        ref: 'Files'
    },
    reminders: {
        type: [Schema.Types.ObjectId],
        ref: 'Reminders'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

})

module.exports = mongoose.model('Item', ItemSchema)