"use strict";

const express = require("express");
const router = express.Router();
const apiai = require("apiai");
const {async, await} = require('asyncawait');
const actions = require('../actions');
const {User} = require('../models');
const {verifyOTP, isUserPresent, newSession, getUser} = require('../utils/helper');
const sendOTP =  require('../utils/sendOTP');
const ENV = process.env.NODE_ENV || "development";
const {keys} = require('../config')[ENV];
const AI = apiai(keys.apiai.client);

const handleLogin = (res, params, fulfillment) => {
  if (fulfillment) {
    if (params.mobile) {
      const isPresent = await(isUserPresent(params.mobile));
      if (!isPresent) {
        return res.json({ error: false, data: `No user present with mobile number - ${params.mobile}` });
      }
      sendOTP(params.mobile);
    }
    return res.json({ error: false, data: fulfillment });
  }
  const data = await(actions['login'](params));
  return res.json(data);
};

router.get('/bot', (req, res, next) => {
  const request = AI.textRequest(req.query.q, { sessionId: req.query.user });

  request.on('response', async(response => {
    console.log(JSON.stringify(response, undefined, 2));

    const action = response.result.metadata.intentName;
    const fulfillment = response.result.fulfillment.speech;
    const params = response.result.parameters;
    params.reqQuery = req.query;

    if (action == 'login') {
      return handleLogin(res, params, fulfillment);
    }

    if (fulfillment) {
      return res.json({ error: false, data: fulfillment });
    }

    // make sure intent and action are same
    if (action != params.action) {
      const resp = {
        error: false,
        data: "Sorry I am confused, Please try again!"
      }
      return res.json(resp);
    }

    if (!action) {
      const resp = {
        error: false,
        data: "I'm sorry, I don't have the answer to that yet."
      }
      return res.json(resp);
    }

    const user = await(getUser(req));
    if (!user) {
      return res.send({error: false, data: "Please Login!"});
    }

    const data = await(actions[action](user, params));
    res.json(data);
  }));

  request.on('error', error => {
    console.log(error);
    res.status(500).send('ERROR!');
  });

  request.end();
});

router.post("/sendOtp", async((req, res) => {
  const isPresent = await(isUserPresent(req.body.mobileNumber));
  sendOTP(req.body.mobileNumber);
  res.status(200).send({error: false, isPresent: isPresent});
}));

router.post("/login", async((req, res) => {
  const validOTP = await(verifyOTP(req.body.mobileNumber));
  if (!validOTP) {
    return res.status(200).send({ error: true, message: "OTP doesn't Match" });
  }
  User
    .findOne({mobile: req.body.mobileNumber})
    .then(user => {
      const sessionToken = newSession(user);
      res.status(200).send({error: false, sessionToken: sessionToken });
    })
    .catch(err => {
      res.status(500).send({ error: true, message: "Internal Server Error" });
    });
}));

router.post("/signup", async((req, res) => {
  const isPresent = await(isUserPresent(req.body.mobileNumber));
  if (isPresent) {
    return res.status(200).send({ error: true, message: "Customer Already Present" });
  }

  const validOTP = await(verifyOTP(req.body.mobileNumber));
  if (!validOTP) {
    return res.status(200).send({ error: true, message: "OTP doesn't Match" });
  }

  const user = new User({
    mobile: req.body.mobileNumber,
    email: req.body.email,
    name: req.body.name
  });
  user.save();

  const sessionToken = newSession(user);
  res.status(200).send({error: false, sessionToken: sessionToken });
}));

router.get("/user", async((req, res) => {
  const user = await(getUser(req));
  if (!user) {
    return res.send({error: true, data: "Please Login!"});
  }
  res.status(200).send({
    error: false,
    user: {
      name: user.name,
      mobile: user.mobile,
      email: user.email
    }
  });
}));

module.exports = router;
