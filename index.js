"use strict";

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req, res){
    res.send(req.params);
});

const server = app.listen(PORT, function() {
  console.log(`Listening @ http://localhost:${PORT}`);
});
