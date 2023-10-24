const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
  name: String,
  date: String,
  value: Number,
  file: {
    type: Schema.Types.ObjectId,
    ref: "File",
  },
  item: {
    type: Schema.Types.ObjectId,
    ref: "Item",
  },
});

module.exports = mongoose.model("Expense", ExpenseSchema);
