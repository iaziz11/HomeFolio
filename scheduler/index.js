const Agenda = require("agenda");
const Reminder = require("../models/reminder");
const mongoConnectionString = process.env.DB_URL;
const agenda = new Agenda({ db: { address: mongoConnectionString } });
const { sendEmail } = require("../utils");

// [year, month, week, day, hour, minute]
// will be multiplied by reminder.every, then reduced to get sum
// that sum will be added to reminder.nextDate

const timeArray = [
  1000 * 60 * 60 * 24 * 365,
  1000 * 60 * 60 * 24 * 30,
  1000 * 60 * 60 * 24 * 7,
  1000 * 60 * 60 * 24,
  1000 * 60 * 60,
  1000 * 60,
];

agenda.define("check reminders", async (job) => {
  const recurringReminders = await Reminder.find({
    recurring: true,
    nextDate: { $lte: new Date() },
  })
    .populate("user")
    .populate("item");
  const singleReminder = await Reminder.find({
    recurring: false,
    sent: false,
    completed: false,
    nextDate: { $lte: new Date() },
  })
    .populate("user")
    .populate("item");
  console.log(new Date().toISOString());
  console.log(recurringReminders);
  console.log(singleReminder);
  for (let rr of recurringReminders) {
    rr.nextDate = new Date(
      rr.nextDate.getTime() +
        rr.every.reduce(function (r, a, i) {
          return r + a * timeArray[i];
        }, 0)
    ).toISOString();
    await rr.save();
    await sendEmail(
      rr.user.username,
      `Your reminder to ${rr.text}`,
      `<h1>Hello ${rr.user.firstName}</h1>
    <p>This is your recurring reminder to ${rr.text} for your ${rr.item.name}</p>
    <p>Your next reminder will be on ${rr.nextDate}</p>`
    );
  }
  for (let sr of singleReminder) {
    sr.sent = true;
    await sendEmail(
      sr.user.username,
      `Your reminder to ${sr.text}`,
      `<h1>Hello ${sr.user.firstName}</h1>
      <p>This is your reminder to ${sr.text} for your ${sr.item.name}</p>`
    );
    await sr.save();
  }
});

// first day of every month: 0 0 12 1 * ?
// every 10 minutes: 0 */10 * ? * *

(async function () {
  console.log("starting agenda");
  await agenda.start();
  const jobs = await agenda.jobs({ name: "check reminders" });
  if (!jobs.length) {
    await agenda.every("0 * * ? * *", "check reminders");
  }
})();

//add () when calling
