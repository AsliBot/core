"use strict";

const app = require('express')();
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes');
const helper = require('./utils/helper');
const cron = require('./utils/cron');
const server = http.createServer(app);
const env = process.env.NODE_ENV || "DEV";
const config = require('./config')[env];
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.Promise = global.Promise;

app.use('/', helper.loginCheckMiddleware)
app.use('/', helper.userInfoMiddleware);
app.use('/', routes);

mongoose.connect(config.database, (err) => {
    if(err) throw err;
    server.listen(PORT, () => {
      console.log(`AsliBot server listening on port ${PORT} in ${env} mode`);
    })
});
