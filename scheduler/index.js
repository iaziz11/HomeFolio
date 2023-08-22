const Agenda = require('agenda');
const nodemailer = require("nodemailer");
const Reminder = require('../models/reminder')
const mongoConnectionString = process.env.DB_URL;
const agenda = new Agenda({ db: { address: mongoConnectionString } });

// [year, month, week, day, hour, minute]
// will be multiplied by reminder.every, then reduced to get sum
// that sum will be added to reminder.nextDate

const timeArray = [1000 * 60 * 60 * 24 * 365, 1000 * 60 * 60 * 24 * 30, 1000 * 60 * 60 * 24 * 7, 1000 * 60 * 60 * 24, 1000 * 60 * 60, 1000 * 60]

const sendEmail = async (to, subject, body) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Your Scheduler" <foo@example.com>', // sender address
        to, // list of receivers
        subject, // Subject line
        html: body, // html body
    });

    console.log("Message sent: %s", info.messageId);
}


agenda.define(
    'query reminders',
    async job => {
        const recurringReminders = await Reminder.find({ recurring: true, nextDate: { $lte: new Date().toISOString() } }).populate('user');
        const singleReminder = await Reminder.find({ recurring: false, sent: false, nextDate: { $lte: new Date().toISOString() } }).populate('user');
        console.log(new Date().toISOString())
        console.log(recurringReminders);
        console.log(singleReminder)
        for (let rr of recurringReminders) {
            rr.nextDate = new Date((Date.now() + rr.every.reduce(function (r, a, i) { return r + a * timeArray[i] }, 0))).toISOString();
            await sendEmail('imrannoah11@gmail.com', `Your reminder to ${rr.text}`, `<h1>Hello ${rr.user.username}</h1> <p>You have to ${rr.text}</p><p>Your next reminder will be on ${rr.nextDate.toISOString()}</p>`);
            await rr.save();
        }
        for (let sr of singleReminder) {
            sr.sent = true;
            await sendEmail('imrannoah11@gmail.com', `Your reminder to ${sr.text}`, `<h1>Hello ${sr.user.username}</h1> <p>You have to ${sr.text}</p>`);
            await sr.save();

        }
    }
);

// first day of every month: 0 0 12 1 * ?
// every 10 minutes: 0 */10 * ? * *

(async function () {
    console.log('starting agenda')
    await agenda.start();
    const jobs = await agenda.jobs({ name: 'query reminders' });
    if (!jobs.length) {
        await agenda.every('0 */10 * ? * *', 'query reminders')
    }
});

//add () when calling