"use strict";

const express = require("express");
const router = express.Router();
const apiai = require("apiai");
const {async, await} = require('asyncawait');
const actions = require('../actions');
const ENV = process.env.NODE_ENV || "development";
const {keys} = require('../config')[ENV];
const AI = apiai(keys.apiai.client);

router.get('/', (req, res) => {
  const request = AI.textRequest(req.query.q, { sessionId: req.query.user });

  request.on('response', async(response => {
    console.log(JSON.stringify(response, undefined, 2));

    const fulfillment = response.result.fulfillment.speech;
    if(fulfillment) return res.json({ error: false, data: fulfillment });

    const action = response.result.metadata.intentName;
    const params = response.result.parameters;

    // make sure intent and action are same
    if (action != params.action) {
      const resp = {
        error: false,
        data: "Sorry I am confused, Please try again!"
      }
      return res.json(resp);
    }

    const data = await(actions[action](req.user, params));
    res.json(data);
  }));

  request.on('error', error => {
    console.log(error);
    res.status(500).send('ERROR!');
  });

  request.end();
});

module.exports = router;
