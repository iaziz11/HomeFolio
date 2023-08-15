const Expense = require('../models/expense');
const Item = require('../models/item');

module.exports.getExpenses = async (req, res) => {
    const { itemId } = req.params;
    const currentItem = await Item.findById(itemId);
    const expenses = await Expense.find({ _id: { $in: currentItem.expenses } });
    res.send(expenses);
}

module.exports.getExpense = async (req, res) => {
    const { id } = req.params;
    const expense = await Expense.findById(id);
    res.send(expense);
}

module.exports.addExpense = async (req, res) => {
    const { itemId } = req.params;
    const expense = new Expense(req.body.expense);
    const currentItem = await Item.findById(itemId);
    currentItem.expenses.push(expense._id);
    expense.item = currentItem._id;
    await expense.save();
    await currentItem.save();
    res.redirect(`${itemId}/expenses`);
}

module.exports.editExpense = async (req, res) => {
    const { id } = req.params;
    const newExpense = req.body.expense;
    const expense = await Expense.findByIdAndUpdate(id, newExpense, { new: true, runValidators: true });
    res.send(expense);
}

module.exports.deleteExpense = async (req, res) => {
    const { id, itemId } = req.params;
    await Expense.findByIdAndDelete(id);
    await Item.findByIdAndUpdate(itemId, { $pull: { expenses: id } });
    res.redirect(`${itemId}/expenses`)
}