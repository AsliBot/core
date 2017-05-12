"use strict";

const uuid = require("uuid");
const {async, await} = require('asyncawait');
const {User} = require('../models');
const redis = require('./redis');

const getUser = req => {
  const key = `${req.query.platform}_${req.query.user}`;
  const user = await( redis.get(key) );
  if (user) {
    return JSON.parse(user);
  }
  const condition = {};
  condition[req.query.platform] = req.query.user;
  return User
    .findOne(condition, (err, user) => {
    if (err || !user) return null;
    redis.set(key, JSON.stringify(user));
    return user;
  });
};

const verifyOTP = async(mobileNumber => {
  const otpKey = "otp_" + mobileNumber;
	const otp = await(redis.get(otpKey));
  redis.del(otpKey);
	return otp ? true : false;
});

const isUserPresent = mobileNumber => {
  return User
  .findOne({mobile: mobileNumber})
  .then(user => {
    return user ? true : false;
  });
  return false;
};

const newSession = user => {
  const sessionToken = uuid.v1();
  const key = `web_${sessionToken}`;
  redis.set(key, JSON.stringify(user));
  redis.expire(key, 60*60);
  return sessionToken;
};

module.exports = {
  getUser,
  verifyOTP,
  isUserPresent,
  newSession
};
