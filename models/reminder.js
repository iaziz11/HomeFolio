const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReminderSchema = new Schema({
    text: String,
    nextDate: Date,
    recurring: Boolean,
    every: [Number],
    completed: Boolean,
    sent: Boolean,
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Item'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Reminder', ReminderSchema)