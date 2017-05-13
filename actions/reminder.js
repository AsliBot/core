"use strict";

const moment = require('moment');
const {async, await} = require('asyncawait');
const {Reminder} = require('../models');

const createRecord = (mobile, task, datetime) => {
  const reminder = new Reminder({
    mobile: mobile,
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
  let DATA = await( createRecord(user.mobile, params['task'], datetime) );
  if (DATA) {
    const sayDate = moment(datetime).format("Do MMMM, h:mm a");
    return { error: false, data: `Sure! I will remind you to ${DATA.task} on ${sayDate}` };
  }
  return { error: true, data: "Oh no, there has been an internal server error" };
});

module.exports = init;
