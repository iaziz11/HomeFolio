const Agenda = require("agenda");
const Reminder = require("../models/reminder");
const ResetRequest = require("../models/passwordResetRequest");
const mongoConnectionString = process.env.DB_URL;
const agenda = new Agenda({ db: { address: mongoConnectionString } });
const { sendEmail, getFormattedDate } = require("../utils");

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

agenda.define("check expired reset requests", async (job) => {
  const expiredRequests = await ResetRequest.find({
    expires: { $lte: new Date() },
  });
  for (let i of expiredRequests) {
    await ResetRequest.findByIdAndDelete(i._id);
  }
});

agenda.define("check reminders", async (job) => {
  const recurringReminders = await Reminder.find({
    recurring: true,
  })
    .populate("user")
    .populate("item");
  const singleReminder = await Reminder.find({
    recurring: false,
    sent: false,
    completed: false,
  })
    .populate("user")
    .populate("item");
  for (let rr of recurringReminders) {
    let compareDate = new Date(rr.nextDate + "Z");
    if (compareDate.getTime() <= Date.now()) {
      if (rr.every[1] > 0) {
        let addMonths = compareDate.getMonth() + rr.every[1];
        let newMonth = addMonths % 12;
        let addYears = Math.floor(addMonths / 12);
        compareDate.setFullYear(compareDate.getFullYear() + addYears, newMonth);
        rr.nextDate = getFormattedDate(compareDate.toISOString());
      } else if (rr.every[0] > 0) {
        compareDate.setFullYear(compareDate.getFullYear() + rr.every[0]);
        rr.nextDate = getFormattedDate(compareDate.toISOString());
      } else {
        rr.nextDate = getFormattedDate(
          new Date(
            compareDate.getTime() +
              rr.every.reduce(function (r, a, i) {
                return r + a * timeArray[i];
              }, 0)
          ).toISOString()
        );
      }
      await rr.save();
      await sendEmail(
        rr.user.username,
        `Your reminder to ${rr.text}`,
        `<h1>Hello ${rr.user.firstName}</h1>
    <p>This is your recurring reminder to ${rr.text} for your ${rr.item.name}</p>
    <p>Your next reminder will be on ${rr.nextDate}</p>`
      );
    }
  }
  for (let sr of singleReminder) {
    let compareDate = new Date(sr.nextDate + "Z");
    if (compareDate.getTime() <= Date.now()) {
      sr.sent = true;
      await sendEmail(
        sr.user.username,
        `Your reminder to ${sr.text}`,
        `<h1>Hello ${sr.user.firstName}</h1>
      <p>This is your reminder to ${sr.text} for your ${sr.item.name}</p>`
      );
      await sr.save();
    }
  }
});

// first day of every month: 0 0 12 1 * ?
// every 10 minutes: 0 */10 * ? * *

(async function () {
  console.log("Starting Agenda");
  await agenda.start();
  await agenda.every("0 * * ? * *", [
    "check reminders",
    "check expired reset requests",
  ]);
})();

//add () when calling
