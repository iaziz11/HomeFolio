const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    value: String,
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Item'
    }
})

module.exports = mongoose.model('Expense', expenseSchema)