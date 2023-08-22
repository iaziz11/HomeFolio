const Reminder = require('../models/reminder');
const Item = require('../models/item');

module.exports.getReminders = async (req, res) => {
    const { itemId } = req.params;
    const currentItem = await Item.findById(itemId);
    const reminders = await Reminder.find({ _id: { $in: currentItem.reminders } });
    res.render('items/reminders', { reminders });
}

module.exports.getReminder = async (req, res) => {
    const { id } = req.params;
    const reminder = await Reminder.findById(id);
    res.send(reminder);
}

module.exports.addReminder = async (req, res) => {
    const { itemId } = req.params;
    req.body.reminder.every = req.body.reminder.every.split(" ");
    const reminder = new Reminder(req.body.reminder);
    reminder.user = req.user._id;
    reminder.sent = false;
    reminder.completed = false;
    const currentItem = await Item.findById(itemId);
    currentItem.reminders.push(reminder._id);
    reminder.item = currentItem._id;
    await reminder.save()
    await currentItem.save();
    res.redirect('/items');
}

module.exports.editReminder = async (req, res) => {
    const { id } = req.params;
    const newReminder = req.body.reminder;
    const reminder = await Reminder.findByIdAndUpdate(id, newReminder, { new: true, runValidators: true });
    res.send(reminder);
}

module.exports.deleteReminder = async (req, res) => {
    const { id, itemId } = req.params;
    await Reminder.findByIdAndDelete(id);
    await Item.findByIdAndUpdate(itemId, { $pull: { reminders: id } });
    res.redirect('/items');
}