const express = require('express');
const router = express.Router();

const expenses = []

router.get('/', (req, res) => {
    //fetch all expenses from database
    res.send(expenses)
})

router.get('/:id', (req, res) => {
    //fetch one expenses from database
    const { id } = req.params;
    res.send(expenses[id])
})

router.post('/', (req, res) => {
    //add expenses to database
    const newExpense = req.body;
    console.log(req.body);
    expenses.push(newExpense);
    res.send('Added expense');
})

router.put('/:id', (req, res) => {
    //update expenses
    const newExpense = req.body;
    const { id } = req.params;
    expenses[id] = newExpense;
    res.send('Successfully updated')
})

router.delete('/:id', (req, res) => {
    //delete expenses
    const { id } = req.params;
    expenses.splice(id, 1);
    res.send('Successfully deleted')
})

module.exports = router;