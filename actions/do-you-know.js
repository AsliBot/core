"use strict";

const {async, await} = require('asyncawait');
const {Remember} = require('../models');

const findRecord = (mobile, key) => {
  const query = { key: key, mobile: mobile };
  return Remember
    .findOne(query)
    .exec((error, result) => {
      if (error) return null;
      return result;
    });
};

const init = async((user, params) => {
  let DATA = await( findRecord(user.mobile, params['key']) );
  if (DATA) {
    return { error: false, data: `${DATA.key} is ${DATA.value}` };
  }
  return { error: false, data: `No I don't know ${params['key']}` };
});

module.exports = init;
