"use strict";

const {async, await} = require('asyncawait');
const {User} = require('../models');
const {verifyOTP} = require('../utils/helper');
const redis = require('../utils/redis');

const login = params => {
  return User
    .findOne({ mobile: params.mobile })
    .then(user => {
      user[params.reqQuery.platform] = params.reqQuery.user;
      user.save();
      const key = `${params.reqQuery.platform}_${params.reqQuery.user}`;
      redis.set(key, JSON.stringify(user));
      return {error: false, data: "Successfully Logged In!"};
    })
    .catch(err => {
      return { error: true, data: "Oh no, there has been an internal server error" };
    });
}

const init = async(params => {
  const validOTP = await(verifyOTP(params.mobile));
  if (!validOTP) {
    return { error: true, data: "OTP doesn't Match" };
  }
  const DATA = await(login(params));
  return DATA;
});

module.exports = init;
