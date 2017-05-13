"use strict";

const moment = require('moment');
const {async, await} = require('asyncawait');
const {Reminder, User} = require('../models');
const sms = require('./sms');

const getReminders = datetime => {
  return Reminder
    .find({
      completed: false,
      datetime: datetime
    })
    .exec((err, reminders) => {
      if (err) return null;
      for (let reminder of reminders) {
        reminder.completed = true;
        reminder.save();
      }
      return reminders;
    });
}

const getUser = mobile => {
  return User
    .findOne({
      mobile: mobile
    })
    .exec((err, res) => {
      if (err) return null;
      return res;
    });
}

const reminderCron = async(() => {
  const datetime = moment( moment(new Date()).format("YYYY-MM-DD HH:mm") ).format();
  const reminders = await(getReminders(datetime));
  for (let reminder of reminders) {
    const user = await(getUser(reminder.mobile));
    if (!user) return;
    const {name, mobile} = JSON.parse( JSON.stringify(user) );      // weird mongoose hack
    const message = `\nHello ${name},\nHere's your reminder: ${reminder.task}`;
    sms.send(mobile, message, err  => {
      if (err) return console.log("Error sending SMS");
      console.log(`SMS sent to ${mobile}`);
    });
  }
});

const init = () => {

  setInterval(() => {
    reminderCron();
  }, 60000);

};

module.exports = {
  init
};
