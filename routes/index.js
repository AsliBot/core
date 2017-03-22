"use strict";

const express = require("express");
const router = express.Router();
const apiai = require("apiai");
const {async, await} = require('asyncawait');
const actions = require('../actions');
const env = process.env.NODE_ENV || "DEV";
const {keys} = require('../config')[env];
const AI = apiai(keys.apiai.client);

router.get('/', (req, res) => {
    const request = AI.textRequest(req.query.q, { sessionId: req.query.user });

    request.on('response', async(response => {
        console.log(JSON.stringify(response, undefined, 2));

        const fulfillment = response.result.fulfillment.speech;
        if(fulfillment) return res.json({ error: false, data: fulfillment });

        const action = response.result.metadata.intentName;
        const params = response.result.parameters;

        const data = await(actions[action](params));
        res.json(data);
    }));

    request.on('error', error => {
        console.log(error);
        res.status(500).send('ERROR!');
    });

    request.end();
});

module.exports = router;
