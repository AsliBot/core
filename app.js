"use strict";

const express = require('express');
const apiai = require("apiai");
const {async, await} = require('asyncawait');
const bodyParser = require('body-parser');
const {keys} = require('./config');
const actions = require('./actions');

const app = express();
const PORT = process.env.PORT || 3000;
const AI = apiai(keys.apiai.client);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const request = AI.textRequest(req.query.q, { sessionId: req.query.s });

    request.on('response', async(response => {
        console.log(JSON.stringify(response, undefined, 2));

        const fulfillment = response.result.fulfillment.speech;
        if(fulfillment) return res.send(fulfillment);

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

const server = app.listen(PORT, () => {
  console.log(`Listening @ http://localhost:${PORT}`);
});
