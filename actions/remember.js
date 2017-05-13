"use strict";

const {async, await} = require('asyncawait');
const {Remember} = require('../models');

const createRecord = (mobile, key, value) => {
  const query = { key: key, mobile: mobile };
  const update = { key: key, value: value };
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  return Remember
    .findOneAndUpdate(query, update, options)
    .exec((error, result) => {
      if (error) return null;
      return result;
    });
};

const init = async((user, params) => {
  let DATA = await( createRecord(user.mobile, params['key'], params['value']) );
  if (DATA) {
    return { error: false, data: `Got it! ${params['key']} is ${params['value']}` };
  }
  return { error: true, data: "Oh no, there has been an internal server error" };
});

module.exports = init;
