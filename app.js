"use strict";

const express = require('express');
const apiai = require("apiai");
const app = express();
const bodyParser = require('body-parser');
const {keys} = require('./config');
const actions = require('./actions');

const PORT = process.env.PORT || 3000;

const AI = apiai(keys.apiai.client);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res){
    const request = AI.textRequest(req.query.q, { sessionId: '1234' });

    request.on('response', function(response) {
        console.log(response);
        const action = response.result.metadata.intentName;
        const params = response.result.parameters;
        const data = actions[action](params);
        res.send(data);
    });

    request.on('error', function(error) {
        console.log(error);
        res.status(500).send('ERROR!');
    });

    request.end();
});

const server = app.listen(PORT, function() {
  console.log(`Listening @ http://localhost:${PORT}`);
});
