"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes');
const helper = require('./utils/helper');
const cron = require('./utils/cron');
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "development";
const config = require('./config')[ENV];
const app = express();
let SERVER;

const initMiddlewares = () => {
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "accept, Content-Type, X-CAuth-Token, authorization, X-CAccess-Id, X-Signature, X-Payload, X-Login-Token");
    if ('OPTIONS' == req.method) {
      return res.send(204);
    }
    next();
  });
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  mongoose.Promise = global.Promise;
};

const initRoutes = () => {
  app.use('/api', routes);
};

const startServer = () => {
  mongoose.connect(config.database, (err) => {
    if(err) throw err;
    SERVER = app.listen(PORT, (err) => {
    	if(err) throw err;
      console.log(`AsliBot server is running on port ${PORT} in ${ENV} environment`);
    });
  });
};

const gracefullyShutdown = () => {
  mongoose.connection.close( () => {
    console.log('Mongoose Disconnected Successfully');
    SERVER.close( () => {
      console.log('Server Stopped');
      process.exit(0);
    });
  });
  // Forcefully shutdown after 5s
  setTimeout( () => {
    console.log('Forcefully Shutting Down');
    process.exit(0);
  }, 5000);
};

initMiddlewares();
initRoutes();
startServer();
cron.init();
process.on('SIGINT', gracefullyShutdown);
process.on('SIGTERM', gracefullyShutdown);
