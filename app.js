"use strict";

const app = require('express')();
const http = require('http');
const bodyParser = require('body-parser');
const models = require('./models');
const routes = require('./routes');
const helper = require('./utils/helper');
const cron = require('./utils/cron');
const server = http.createServer(app);
const env = process.env.NODE_ENV || "DEV";
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', helper.loginCheckMiddleware)
app.use('/', helper.userInfoMiddleware);
app.use('/', routes);

// models.sequelize.sync({force: true}).then(() => {
models.sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`AsliBot server listening on port ${PORT} in ${env} mode`);
  })
});
