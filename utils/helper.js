"use strict";

const {async, await} = require('asyncawait');
const models = require('../models');

const userInfo = (condition) => {
  return models.User.findOne({ where: condition })
    .then( user => {
      return (user) ? user.dataValues : null;
    });
};

const userInfoMiddleware = async((req, res, next) => {
  const condition = {};
  condition[`${req.query.p}`] = req.query.s;
  const USER = await( userInfo(condition) );
  req.user = USER;
  next();
});

module.exports = {
  userInfoMiddleware
};
