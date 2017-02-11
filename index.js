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
    // will show urlencoded variables only
    // example: http://localhost:3000?user=xyz will produce
    // {user: xyz}
    // while others can be accessed using req.body
    res.send(req.query);
});

const server = app.listen(PORT, function() {
  console.log(`Listening @ http://localhost:${PORT}`);
});
