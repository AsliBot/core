"use strict";

const {async, await} = require('asyncawait');
const models = require('../models');
const redis = require('./redis');

const setToken = (user) => {
  let update = {};
  update[req.query.platform] = req.query.user;
  models.User
    .update(update, { where: { username: text[1] } })
    .then( result => {
      const key = `${req.query.platform}_${req.query.user}`;
      redis.set(key, JSON.stringify(user.dataValues));
      res.json({error: false, data: "Successfully Logged In!"});
    });
};

const loginCheckMiddleware = (req, res, next) => {
  const text = req.query.q.toLowerCase().split(" ");
  if(text.length !=3 || text[0] != "login") {
    return next();
  }
  models.User
    .findOne({ where: {username: text[1] , password: text[2]} })
    .then( user => {
      if(!user) throw new Error("User Not Found");
      setToken(user);
    })
    .catch( err => {
      res.json({error: false, data: "Invalid Credentials!"});
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
  models.User
    .findOne({ where: condition })
    .then( user => {
      if(!user) throw new Error("User Not Found");
      redis.set(key, JSON.stringify(user.dataValues));
      req.user = user.dataValues;
      next();
    })
    .catch( err => {
      res.json({error: false, data: "Unauthorized, Please Login!"});
    });
});

module.exports = {
  loginCheckMiddleware,
  userInfoMiddleware
};
