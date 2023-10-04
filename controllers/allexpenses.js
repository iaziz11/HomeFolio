const Expense = require("../models/expense");
const Item = require("../models/item");

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

module.exports.updateExpenseRange = async (req, res) => {
  const userItems = await Item.find({ user: req.user._id });
  const userItemsIds = userItems.map((e) => e._id);
  let expenses = [];
  let expenseDict = {};
  let timeRange = "all";
  if (Object.keys(req.query).length !== 0) {
    timeRange = req.query.time;
  }
  switch (timeRange) {
    case "all":
      expenses = await Expense.find({ item: { $in: userItemsIds } }).populate(
        "item"
      );
      break;
    case "year":
      curDate = new Date();
      compareDate = new Date(`1/1/${curDate.getFullYear()}`);
      expenses = await Expense.find({
        item: { $in: userItemsIds },
        date: { $gte: compareDate },
      }).populate("item");
      break;
    case "month":
      curDate = new Date();
      compareDate = new Date(
        `${curDate.getMonth() + 1}/1/${curDate.getFullYear()}`
      );
      expenses = await Expense.find({
        item: { $in: userItemsIds },
        date: { $gte: compareDate },
      }).populate("item");
      break;
    case "week":
      curDate = new Date();
      compareDate = new Date(curDate.getTime() - 1000 * 60 * 60 * 24 * 7);
      expenses = await Expense.find({
        item: { $in: userItemsIds },
        date: { $gte: compareDate },
      }).populate("item");
      break;
  }
  expenses.map((e) => {
    if (!(e.item._id in expenseDict)) {
      expenseDict[e.item._id] = [e.value, e.item.color, e.item.name];
    } else {
      expenseDict[e.item._id][0] += e.value;
    }
  });
  console.log(JSON.stringify(expenseDict));
  res.send({ expenseDict: JSON.stringify(expenseDict) });
};
