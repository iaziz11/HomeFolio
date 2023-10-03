const Expense = require("../models/expense");
const Item = require("../models/item");

module.exports.getExpenses = async (req, res) => {
  const { itemId } = req.params;
  res.locals.itemId = itemId;
  const currentItem = await Item.findById(itemId);
  const expenses = await Expense.find({
    _id: { $in: currentItem.expenses },
  }).populate("file");

  let total = expenses.reduce((r, e) => r + e.value, 0);
  res.render("items/expenses", {
    expenses,
    total,
    currentItem: currentItem.name,
  });
};

module.exports.updateExpenseRange = async (req, res) => {
  const { itemId } = req.params;
  res.locals.itemId = itemId;
  const currentItem = await Item.findById(itemId);
  let expenses = [];
  let timeRange = "all";
  let curDate;
  let compareDate;
  if (Object.keys(req.query).length !== 0) {
    timeRange = req.query.time;
  }
  switch (timeRange) {
    case "all":
      expenses = await Expense.find({
        _id: { $in: currentItem.expenses },
      }).populate("file");
      break;
    case "year":
      curDate = new Date();
      compareDate = new Date(`1/1/${curDate.getFullYear()}`);
      expenses = await Expense.find({
        _id: { $in: currentItem.expenses },
        date: { $gte: compareDate },
      }).populate("file");
      break;
    case "month":
      curDate = new Date();
      compareDate = new Date(
        `${curDate.getMonth() + 1}/1/${curDate.getFullYear()}`
      );
      expenses = await Expense.find({
        _id: { $in: currentItem.expenses },
        date: { $gte: compareDate },
      }).populate("file");
      break;
    case "week":
      curDate = new Date();
      compareDate = new Date(curDate.getTime() - 1000 * 60 * 60 * 24 * 7);
      expenses = await Expense.find({
        _id: { $in: currentItem.expenses },
        date: { $gte: compareDate },
      }).populate("file");
      break;
  }
  let total = expenses.reduce((r, e) => r + e.value, 0);
  res.send({ expenses, total });
};

module.exports.getAllExpenses = async (req, res) => {
  let expenseDict = {};
  const userItems = await Item.find({ user: req.user._id });
  const userItemsIds = userItems.map((e) => e._id);
  const expenses = await Expense.find({ item: { $in: userItemsIds } }).populate(
    "item"
  );

  expenses.map((e) => {
    if (!(e.item._id in expenseDict)) {
      expenseDict[e.item._id] = [e.value, e.item.color, e.item.name];
    } else {
      expenseDict[e.item._id][0] += e.value;
    }
  });
  res.render("allexpenses", { expenseDict: JSON.stringify(expenseDict) });
};

module.exports.getExpense = async (req, res) => {
  const { id } = req.params;
  const expense = await Expense.findById(id);
  res.send(expense);
};

module.exports.addExpense = async (req, res) => {
  const { itemId } = req.params;
  req.body.expense.date = new Date(req.body.expense.date);
  req.body.expense.value = Math.round(req.body.expense.value * 100);
  const expense = new Expense(req.body.expense);
  const currentItem = await Item.findById(itemId);
  currentItem.expenses.push(expense._id);
  expense.item = currentItem._id;
  await expense.save();
  await currentItem.save();
  req.flash("success", "Added expense successfully");
  res.send("Added");
};

module.exports.editExpense = async (req, res) => {
  const { id } = req.params;
  const newExpense = req.body.expense;
  req.body.expense.value = Math.round(req.body.expense.value * 100);
  const expense = await Expense.findByIdAndUpdate(id, newExpense, {
    new: true,
    runValidators: true,
  });
  req.flash("success", "Successfully edited expense");
  res.send(expense);
};

module.exports.deleteExpense = async (req, res) => {
  const { id, itemId } = req.params;
  await Expense.findByIdAndDelete(id);
  await Item.findByIdAndUpdate(itemId, { $pull: { expenses: id } });
  req.flash("success", "Successfuly deleted expense");
  res.send("Success");
};
