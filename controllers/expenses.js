const Expense = require('../models/Expense');

module.exports.getExpenses = async (req, res) => {
    const expenses = await Expense.find({});
    res.send(expenses);
}

module.exports.getExpense = async (req, res) => {
    const { id } = req.params;
    const expense = await Expense.findById(id);
    res.send(expense);
}

module.exports.addExpense = async (req, res) => {
    const expense = new Expense(req.body.expense);
    await expense.save()
    res.send('Added Expenses');
}

module.exports.editExpense = async (req, res) => {
    const { id } = req.params;
    const newExpense = req.body.expense;
    const expense = await Expense.findByIdAndUpdate(id, newExpense, { new: true, runValidators: true });
    res.send(expense);
}

module.exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    await Expense.findByIdAndDelete(id);
    res.redirect('/expenses')
}