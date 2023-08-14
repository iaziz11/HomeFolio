const express = require('express');
const router = express.Router();
const expenses = require('../controllers/expenses')

router.route('/')
    .get(expenses.getExpenses)
    .post(expenses.addExpense)

router.route('/:id')
    .get(expenses.getExpense)
    .put(expenses.editExpense)
    .delete(expenses.deleteExpense)

module.exports = router;