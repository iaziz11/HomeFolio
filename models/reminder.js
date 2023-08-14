const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReminderSchema = new Schema({
    text: String,
    date: Date,
    completed: Boolean,
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Item'
    }
})

module.exports = mongoose.model('Reminder', ReminderSchema)