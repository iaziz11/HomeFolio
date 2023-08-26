const Reminder = require('../models/reminder');
const Item = require('../models/item');

module.exports.getReminders = async (req, res) => {
    const { itemId } = req.params;
    res.locals.itemId = itemId;
    const currentItem = await Item.findById(itemId);
    const reminders = await Reminder.find({ _id: { $in: currentItem.reminders } });
    const newReminders = reminders.map((e) => {
        let oldDate = new Date(e.nextDate)
        let newDate = (oldDate.getMonth() + 1) + '/' + oldDate.getDate() + '/' + oldDate.getFullYear() + ' @ ' + oldDate.getHours() % 12 + ':' + oldDate.getMinutes() + (oldDate.getHours() > 12 ? 'pm' : 'am');
        return {
            ...e.toObject(),
            nextDate: newDate
        }
    })
    res.render('items/reminders', { reminders: newReminders });
}

module.exports.getReminder = async (req, res) => {
    const { id } = req.params;
    const reminder = await Reminder.findById(id);
    res.send(reminder);
}

module.exports.addReminder = async (req, res) => {
    const { itemId } = req.params;
    req.body.reminder.every = req.body.reminder.every.split(" ");
    const newReminder = new Reminder(req.body.reminder);
    if (req.body.reminder.recurring) {
        newReminder.recurring = true;
    } else {
        newReminder.recurring = false;
    }
    newReminder.user = req.user._id;
    newReminder.sent = false;
    newReminder.completed = false;
    const currentItem = await Item.findById(itemId);
    currentItem.reminders.push(newReminder._id);
    newReminder.item = currentItem._id;
    await newReminder.save()
    await currentItem.save();
    req.flash('success', 'Successfully Added Reminder')
    res.send('Added reminder');
}

module.exports.editReminder = async (req, res) => {
    const { id } = req.params;
    const newReminder = req.body.reminder;
    if (newReminder.recurring && newReminder.recurring === 'on') {
        newReminder.recurring = true;
    } else {
        newReminder.recurring = false;
    }
    newReminder.every ? newReminder.every = newReminder.every.split(" ") : null;
    const reminder = await Reminder.findByIdAndUpdate(id, newReminder, { new: true, runValidators: true });
    req.flash('success', 'Successfully Edited Reminder')
    res.send(reminder);
}

module.exports.toggleCompleted = async (req, res) => {
    const { id } = req.params;
    const oldReminder = await Reminder.findById(id);
    await Reminder.findByIdAndUpdate(id, { completed: !oldReminder.completed }, { new: true, runValidators: true });
    res.send('Changed');
}

module.exports.deleteReminder = async (req, res) => {
    const { id, itemId } = req.params;
    await Reminder.findByIdAndDelete(id);
    await Item.findByIdAndUpdate(itemId, { $pull: { reminders: id } });
    req.flash('success', 'Successfully Deleted Reminder')
    res.send('Deleted');
}