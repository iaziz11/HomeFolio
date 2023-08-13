const Reminder = require('../models/reminder');

module.exports.getReminders = async (req, res) => {
    const reminders = await Reminder.find({});
    res.send(reminders);
}

module.exports.getReminder = async (req, res) => {
    const { id } = req.params;
    const reminder = await Reminder.findById(id);
    res.send(reminder);
}

module.exports.addReminder = async (req, res) => {
    const reminder = new Reminder(req.body.reminder);
    await reminder.save()
    res.send('Added reminder');
}

module.exports.editReminder = async (req, res) => {
    const { id } = req.params;
    const newReminder = req.body.reminder;
    const reminder = await Reminder.findByIdAndUpdate(id, newReminder, { new: true, runValidators: true });
    res.send(reminder);
}

module.exports.deleteReminder = async (req, res) => {
    const { id } = req.params;
    await Reminder.findByIdAndDelete(id);
    res.redirect('/reminders')
}