const Expense = require('../models/expense');
const Item = require('../models/item');

module.exports.getExpenses = async (req, res) => {
    const { itemId } = req.params;
    res.locals.itemId = itemId;
    const currentItem = await Item.findById(itemId);
    const expenses = await Expense.find({ _id: { $in: currentItem.expenses } }).populate('file');
    let total = expenses.reduce((r, e) => r + e.value, 0);
    const newExpenses = expenses.map((e) => {
        let oldDate = new Date(e.date)
        let newDate = (oldDate.getMonth() + 1) + '/' + oldDate.getDate() + '/' + oldDate.getFullYear() + ' @ ' + oldDate.getHours() % 12 + ':' + oldDate.getMinutes() + (oldDate.getHours() > 12 ? 'pm' : 'am');
        return {
            ...e.toObject(),
            date: newDate
        }
    })
    res.render('items/expenses', { expenses: newExpenses, total });
}

module.exports.getExpense = async (req, res) => {
    const { id } = req.params;
    const expense = await Expense.findById(id);
    res.send(expense);
}

module.exports.addExpense = async (req, res) => {
    const { itemId } = req.params;
    req.body.expense.value = Math.round(req.body.expense.value * 100)
    const expense = new Expense(req.body.expense);
    const currentItem = await Item.findById(itemId);
    currentItem.expenses.push(expense._id);
    expense.item = currentItem._id;
    await expense.save();
    await currentItem.save();
    req.flash('success', 'Added expense successfully');
    res.send('Added');
}

module.exports.editExpense = async (req, res) => {
    const { id } = req.params;
    const newExpense = req.body.expense;
    const expense = await Expense.findByIdAndUpdate(id, newExpense, { new: true, runValidators: true });
    req.flash('success', 'Successfully edited expense')
    res.send(expense);
}

module.exports.deleteExpense = async (req, res) => {
    const { id, itemId } = req.params;
    await Expense.findByIdAndDelete(id);
    await Item.findByIdAndUpdate(itemId, { $pull: { expenses: id } });
    req.flash('success', 'Successfuly deleted expense')
    res.send('Success')
}