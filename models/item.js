const mongoose = require("mongoose");
const Expense = require("./expense");
const File = require("./file");
const Reminder = require("./reminder");
const { cloudinary } = require("../cloudinary");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: String,
  icon: String,
  color: String,
  expenses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Expense",
    },
  ],
  files: [
    {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
  ],
  reminders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reminder",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

ItemSchema.post("findOneAndDelete", async (data) => {
  try {
    if (data.expenses.length) {
      await Expense.deleteMany({ _id: { $in: data.expenses } });
    }
    if (data.files.length) {
      for (let file of data.files) {
        const foundFile = await File.findById(file);
        await cloudinary.uploader.destroy(foundFile.fileName);
      }
      await File.deleteMany({ _id: { $in: data.files } });
    }
    if (data.reminders.length) {
      await Reminder.deleteMany({ _id: { $in: data.reminders } });
    }
  } catch (e) {
    console.log("error in deleting");
    console.error(e);
  }
});

module.exports = mongoose.model("Item", ItemSchema);
