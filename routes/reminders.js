var express = require('express');
var router = express.Router();

const reminders = []

router.get('/', (req, res) => {
    //fetch all reminders from database
    res.send(reminders)
})

router.get('/:id', (req, res) => {
    //fetch one reminder from database
    const { id } = req.params;
    res.send(reminders[id])
})

router.post('/', (req, res) => {
    //add reminder to database
    const newReminder = req.body;
    console.log(req.body);
    reminders.push(newReminder);
    res.send('Added reminder');
})

router.put('/:id', (req, res) => {
    //update reminder
    const newReminder = req.body;
    const { id } = req.params;
    reminders[id] = newReminder;
    res.send('Successfully updated')
})

router.delete('/:id', (req, res) => {
    //delete reminder
    const { id } = req.params;
    reminders.splice(id, 1);
    res.send('Successfully deleted')
})

module.exports = router;