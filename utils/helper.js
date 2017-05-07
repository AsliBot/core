"use strict";

const {async, await} = require('asyncawait');
const {User} = require('../models');
const redis = require('./redis');

const loginCheckMiddleware = (req, res, next) => {
  const text = req.query.q.toLowerCase().split(" ");
  if(text.length !=3 || text[0] != "login") {
    return next();
  }
  User.findOne({username : text[1], password: text[2]}, (err, user) => {
    if (err) return next(new Error("Error authenticating user"));
    if (!user) {
      return res.json({error: false, data: "Invalid Credentials!"});
    }
    user[req.query.platform] = req.query.user;
    user.save((err) => {
      if (err) return next(new Error("Error updating user"));
      const key = `${req.query.platform}_${req.query.user}`;
      redis.set(key, JSON.stringify(user));
      res.json({error: false, data: "Successfully Logged In!"});
    });
  });
};

const userInfoMiddleware = async((req, res, next) => {
  const key = `${req.query.platform}_${req.query.user}`;
  const user = await( redis.get(key) );
  if (user) {
    req.user = JSON.parse(user);
    return next();
  }
  const condition = {};
  condition[req.query.platform] = req.query.user;
  User.findOne(condition, (err, user) => {
    if (err) return next(new Error("Error fetching user"));
    if (!user) {
      return res.json({error: false, data: "Please Login!"});
    }
    redis.set(key, JSON.stringify(user));
    req.user = user;
    next();
  });
});

module.exports = {
  loginCheckMiddleware,
  userInfoMiddleware
};
