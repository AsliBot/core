const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReminderSchema = new Schema({
  username: {
    type: String,
    trim: true
  },
  task: {
    type: String,
    trim: true
  },
  datetime: {
    type: Date,
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const Reminder = mongoose.model('Reminder', ReminderSchema);
module.exports = Reminder;
