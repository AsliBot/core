"use strict";

const moment = require('moment');
const {async, await} = require('asyncawait');
const {Reminder} = require('../models');

const createRecord = (username, task, datetime) => {
  const reminder = new Reminder({
    username: username,
    task: task,
    datetime: datetime
  });

  return reminder
    .save()
    .then(saved => saved)
    .catch(err => null);
};

const init = async((user, params) => {
  const datetime = moment(`${params['date']} ${params['time']}`, "YYYY-MM-DD HH:mm").format();
  let DATA = await( createRecord(user.username, params['task'], datetime) );
  if (DATA) {
    const sayDate = moment(datetime).format("Do MMMM, h:mm a");
    return { error: false, data: `Sure! I will remind you to ${DATA.task} on ${sayDate}` };
  }
  return { error: false, data: "Error storing this information" };
});

module.exports = init;
